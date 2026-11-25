#!/usr/bin/env node
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { Worker } from 'node:worker_threads';

const root = resolve(import.meta.dirname, '..');
const lessonsDir = join(root, 'content', 'lessons');
const timeoutMs = 5000;

// This mirrors run_plain_code in public/pyodideWorker.js: empty stdin and
// namespace, stdout followed by stderr, trailing whitespace removed, and the
// same fatal error text / no-output message shown by the browser runner.
const runnerCode = `
import io, json, sys
def run_plain_code(code):
    old_in, old_out, old_err = sys.stdin, sys.stdout, sys.stderr
    sys.stdin, sys.stdout, sys.stderr = io.StringIO(""), io.StringIO(), io.StringIO()
    ns = {}
    try:
        compiled = compile(code, "<user_code>", "exec")
        exec(compiled, ns)
        out, err = sys.stdout.getvalue(), sys.stderr.getvalue()
        total_out = out + (("\\n" + err) if err else "")
        return {"output": total_out.rstrip() if total_out else "(No output printed)"}
    except SyntaxError as e:
        line_info = f" on line {e.lineno}" if e.lineno else ""
        return {"fatal": f"SyntaxError{line_info}: {e.msg}"}
    except EOFError:
        return {"fatal": "EOFError: input() is not supported in this example block."}
    except BaseException as e:
        return {"fatal": f"{type(e).__name__}: {e}"}
    finally:
        sys.stdin, sys.stdout, sys.stderr = old_in, old_out, old_err
`;

const workerSource = `
const { parentPort } = require('node:worker_threads');
const { loadPyodide } = require('pyodide');
(async () => {
  const pyodide = await loadPyodide();
  pyodide.runPython(${JSON.stringify(runnerCode)});
  parentPort.on('message', ({ id, code }) => {
    try {
      pyodide.globals.set('PLAIN_CODE', code);
      const result = JSON.parse(pyodide.runPython('json.dumps(run_plain_code(PLAIN_CODE))'));
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
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      section = trimmed.slice(3).trim().toLowerCase();
    }
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

function execute(worker, id, code) {
  return new Promise((resolveResult, rejectResult) => {
    const timer = setTimeout(() => rejectResult(new Error('Timed out after 5 seconds')), timeoutMs);
    const onMessage = (message) => {
      if (message.id !== id) return;
      clearTimeout(timer);
      worker.off('message', onMessage);
      resolveResult(message.result);
    };
    worker.on('message', onMessage);
    worker.postMessage({ id, code });
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
    .filter(({ block }) => block.info === 'python run' && !(
      (block.section.includes('try it yourself') || block.section.includes('make it yourself'))
      && !hasExecutableStatements(block.body)
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
    let actual;
    try {
      actual = await execute(worker, `${lesson}:${block.line}`, block.body);
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
    if (expectedBlock && actualText === expectedText) {
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
process.exitCode = failCount ? 1 : 0;
