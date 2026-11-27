#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { Worker } from 'node:worker_threads';

const root = resolve(import.meta.dirname, '..');
const lessonsDir = join(root, 'content', 'lessons');
const timeoutMs = 5000;

// Extract the exact shared Python helper embedded in the browser worker.
const browserWorkerSource = readFileSync(join(root, 'public', 'pyodideWorker.js'), 'utf8');
const runnerMatch = browserWorkerSource.match(/const PLAIN_RUNNER_PY = String\.raw`([\s\S]*?)`;/);
if (!runnerMatch) throw new Error('Could not find PLAIN_RUNNER_PY in public/pyodideWorker.js');
const runnerCode = runnerMatch[1];

const workerSource = `
const { parentPort } = require('node:worker_threads');
const { loadPyodide } = require('pyodide');
(async () => {
  const pyodide = await loadPyodide();
  pyodide.runPython(${JSON.stringify(runnerCode)});
  parentPort.on('message', ({ id, code, stdin = '' }) => {
    try {
      pyodide.globals.set('PLAIN_CODE', code);
      pyodide.globals.set('PLAIN_STDIN', stdin);
      const result = JSON.parse(pyodide.runPython('run_plain_code(PLAIN_CODE, PLAIN_STDIN)'));
      parentPort.postMessage({ id, result });
    } catch (error) {
      parentPort.postMessage({ id, result: { fatal: error?.message ?? 'Execution failed' } });
    }
  });
  parentPort.postMessage({ ready: true });
})().catch((error) => parentPort.postMessage({ initError: error?.stack ?? String(error) }));
`;

function fencedBlocks(markdown) {
  const blocks = [];
  const lines = markdown.split(/\r?\n/);
  let section = '';
  let exerciseIndex = null;
  let inSolution = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      section = trimmed.slice(3).trim().toLowerCase();
      exerciseIndex = section === 'make it yourself' ? 0 : null;
      inSolution = false;
    } else if (section === 'try it yourself' && trimmed.startsWith('### ')) {
      exerciseIndex = exerciseIndex === null ? 0 : exerciseIndex + 1;
    }
    if (trimmed.startsWith(':::solution')) inSolution = true;
    else if (trimmed === ':::' && inSolution) inSolution = false;
    const opening = line.match(/^```([^\r\n]*)$/);
    if (!opening) continue;
    const bodyStart = i + 1;
    let closing = bodyStart;
    while (closing < lines.length && !/^```\s*$/.test(lines[closing])) closing += 1;
    if (closing >= lines.length) continue;
    blocks.push({
      info: opening[1].trim(),
      body: lines.slice(bodyStart, closing).join('\n'),
      line: i + 1,
      section,
      exerciseIndex,
      solution: inSolution,
    });
    i = closing;
  }
  return blocks;
}

function hasExecutableStatements(code) {
  return code.split(/\r?\n/).some((line) => line.trim() && !line.trim().startsWith('#'));
}

function expectedFor(blocks, index) {
  for (let i = index + 1; i < blocks.length; i += 1) {
    if (blocks[i].info.startsWith('python') || blocks[i].info === 'output') return blocks[i].info === 'output' ? blocks[i] : null;
  }
  return null;
}

function startWorker() {
  const worker = new Worker(workerSource, { eval: true, cwd: root });
  return worker;
}

function waitReady(worker) {
  return new Promise((resolveReady, rejectReady) => {
    const onMessage = (message) => {
      if (message.initError) rejectReady(new Error(message.initError));
      else if (message.ready) resolveReady();
    };
    worker.on('message', onMessage);
    worker.once('error', rejectReady);
  });
}

function execute(worker, id, code, stdin = '') {
  return new Promise((resolveResult, rejectResult) => {
    const timer = setTimeout(() => rejectResult(new Error('Timed out after 5 seconds')), timeoutMs);
    const onMessage = (message) => {
      if (message.id !== id) return;
      clearTimeout(timer);
      worker.off('message', onMessage);
      resolveResult(message.result);
    };
    worker.on('message', onMessage);
    worker.postMessage({ id, code, stdin });
  });
}

const lessons = readdirSync(lessonsDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
let passCount = 0;
let failCount = 0;
let blockCount = 0;

for (const lesson of lessons) {
  const lessonPath = join(lessonsDir, lesson, 'lesson.md');
  let markdown;
  try { markdown = readFileSync(lessonPath, 'utf8'); } catch { continue; }
  const blocks = fencedBlocks(markdown);
  const runnable = blocks.map((block, index) => ({ block, index }))
    .filter(({ block }) => block.info === 'python run' && (
      !block.section.includes('try it yourself') && !block.section.includes('make it yourself')
      || block.solution
    ));
  if (!runnable.length) continue;

  let worker = startWorker();
  try { await waitReady(worker); }
  catch (error) {
    console.error(`[FAIL] ${lesson} (Pyodide startup): ${error.stack ?? error.message}`);
    failCount += runnable.length;
    blockCount += runnable.length;
    await worker.terminate();
    continue;
  }

  for (const { block, index } of runnable) {
    blockCount += 1;
    const expectedBlock = expectedFor(blocks, index);
    const expectedExercise = block.solution
      ? blocks.find((candidate) => candidate.info === 'expected' && candidate.exerciseIndex === block.exerciseIndex)
      : null;
    const inputExercise = block.solution
      ? blocks.find((candidate) => candidate.info === 'input' && candidate.exerciseIndex === block.exerciseIndex)
      : null;
    let actual;
    try {
      actual = await execute(worker, `${lesson}:${block.line}`, block.body, inputExercise?.body ?? '');
    } catch (error) {
      actual = { fatal: error.message };
      await worker.terminate();
      worker = startWorker();
      try { await waitReady(worker); }
      catch (startupError) {
        console.error(`[FAIL] ${lesson} (line ${block.line}): ${error.message}; Pyodide restart failed: ${startupError.message}`);
        failCount += 1;
        continue;
      }
    }
    const actualText = actual.output ?? actual.fatal;
    const expectedText = expectedBlock?.body.replace(/\s+$/, '');
    const exerciseExpected = expectedExercise?.body.replace(/\s+$/, '');
    if (expectedBlock && actualText === expectedText && (!block.solution || actualText === exerciseExpected)) {
      console.log(`[PASS] ${lesson} (line ${block.line})`);
      passCount += 1;
    } else {
      console.log(`[FAIL] ${lesson} (line ${block.line}): ${!expectedBlock ? `Missing following output block; actual ${JSON.stringify(actualText)}` : `expected ${JSON.stringify(expectedText)}, got ${JSON.stringify(actualText)}`}`);
      failCount += 1;
    }
  }
  await worker.terminate();
}

console.log(`\nPyodide lesson blocks: ${passCount} passed, ${failCount} failed (${blockCount} total).`);

let stdinWorker = startWorker();
let stdinChecks = 0;
let stdinFailures = 0;
try {
  await waitReady(stdinWorker);
  const cases = [
    {
      name: 'two input calls and terminal transcript',
      code: 'name = input("Name: ")\nage = input("Age: ")\nprint(f"{name} is {age}")',
      stdin: 'Asha\n12',
      expected: { output: 'Name: Asha\nAge: 12\nAsha is 12' },
    },
    {
      name: 'integer input arithmetic',
      code: 'a = int(input())\nb = int(input())\nprint(a + b)',
      stdin: '19\n23',
      expected: { output: '19\n23\n42' },
    },
    {
      name: 'read input until done',
      code: 'total = 0\nwhile True:\n    value = input()\n    if value == "done":\n        break\n    total += int(value)\nprint(total)',
      stdin: '3\n8\ndone',
      expected: { output: '3\n8\ndone\n11' },
    },
    {
      name: 'friendly input exhaustion with source line',
      code: 'first = input()\nsecond = input()\nprint(first, second)',
      stdin: 'only-one',
      expected: { fatal: 'Your program asked for more input than you typed in the Input box. Add one line for each input() call. (line 2)' },
    },
    {
      name: 'sys.stdin.read',
      code: 'import sys\nprint(sys.stdin.read().upper())',
      stdin: 'hello\nworld',
      expected: { output: 'HELLO\nWORLD' },
    },
    {
      name: 'unused input lines are allowed',
      code: 'print(input())',
      stdin: 'used\nunused',
      expected: { output: 'used\nused' },
    },
    {
      name: 'sys.stdin.readline',
      code: 'import sys\nprint(sys.stdin.readline().strip())',
      stdin: 'first\nsecond',
      expected: { output: 'first' },
    },
    {
      name: 'sys.stdin.readlines',
      code: 'import sys\nprint(len(sys.stdin.readlines()))',
      stdin: 'first\nsecond\nthird',
      expected: { output: '3' },
    },
    {
      name: 'iterate over sys.stdin',
      code: 'import sys\nfor line in sys.stdin:\n    print(line.strip().upper())',
      stdin: 'north\nsouth',
      expected: { output: 'NORTH\nSOUTH' },
    },
  ];
  for (let index = 0; index < cases.length; index += 1) {
    const test = cases[index];
    stdinChecks += 1;
    const actual = await execute(stdinWorker, `stdin-${index}`, test.code, test.stdin);
    if (JSON.stringify(actual) === JSON.stringify(test.expected)) {
      console.log(`[PASS] stdin: ${test.name}`);
    } else {
      stdinFailures += 1;
      console.error(`[FAIL] stdin: ${test.name}: expected ${JSON.stringify(test.expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  stdinChecks += 1;
  const stateCheck = await execute(stdinWorker, 'stdin-state-1', 'learner_secret = 42\nprint(learner_secret)');
  const afterStateCheck = await execute(stdinWorker, 'stdin-state-2', 'print(learner_secret)');
  if (stateCheck.output === '42' && afterStateCheck.fatal === "NameError on line 1: name 'learner_secret' is not defined") {
    console.log('[PASS] stdin: user variables do not leak across runs');
  } else {
    stdinFailures += 1;
    console.error(`[FAIL] stdin: run isolation: got ${JSON.stringify([stateCheck, afterStateCheck])}`);
  }

  stdinChecks += 1;
  try {
    await execute(stdinWorker, 'stdin-timeout', 'input("Ready: ")\nwhile True:\n    pass', 'yes');
    stdinFailures += 1;
    console.error('[FAIL] stdin: infinite loop did not time out');
  } catch (error) {
    if (error.message === 'Timed out after 5 seconds') console.log('[PASS] stdin: infinite loop reaches the 5-second timeout');
    else {
      stdinFailures += 1;
      console.error(`[FAIL] stdin: unexpected timeout error: ${error.message}`);
    }
  }

  await stdinWorker.terminate();
  stdinWorker = startWorker();
  await waitReady(stdinWorker);
  stdinChecks += 1;
  try {
    await execute(stdinWorker, 'plain-timeout', 'while True:\n    pass');
    stdinFailures += 1;
    console.error('[FAIL] plain run: infinite loop without input did not time out');
  } catch (error) {
    if (error.message === 'Timed out after 5 seconds') console.log('[PASS] plain run: infinite loop without input reaches the 5-second timeout');
    else {
      stdinFailures += 1;
      console.error(`[FAIL] plain run: unexpected timeout error: ${error.message}`);
    }
  }
} catch (error) {
  stdinFailures += 1;
  console.error(`[FAIL] stdin self-tests: ${error.stack ?? error.message}`);
} finally {
  await stdinWorker.terminate();
}

console.log(`Stdin self-tests: ${stdinChecks - stdinFailures} passed, ${stdinFailures} failed (${stdinChecks} total).`);
process.exitCode = failCount || stdinFailures ? 1 : 0;
