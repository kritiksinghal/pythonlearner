/*
 * app/test-markdown/page.tsx
 *
 * Dedicated test page verifying all extended Markdown elements:
 * - GFM tables
 * - Callout boxes (tip, warning, remember, deep)
 * - Collapsible solution block (:::solution)
 * - Output block (```output)
 * - Numbered lists & bullet lists
 * - Blockquotes
 * - Interactive runnable code blocks
 */

import MarkdownView from "@/components/MarkdownView";

const TEST_MARKDOWN = `
## Markdown Elements Test Suite

This page demonstrates and verifies all the custom markdown extensions built for PyLearner.

### 1. Data Tables

| Variable Name | Data Type | Example Value | Description |
| --- | --- | --- | --- |
| count | int | 42 | Whole numbers without decimals |
| ratio | float | 3.1415 | Numbers with fractional points |
| greeting | str | "Hello" | Ordered sequence of characters |
| is_valid | bool | True | Truth value (True or False) |

### 2. Callout Boxes

:::tip Pro Tip on Variable Naming
Always use descriptive, lowercase names separated by underscores (snake_case) in Python. For example, \`user_age\` is much better than \`a\`.
:::

:::warning Common Gotcha
Never use Python keywords like \`def\`, \`class\`, \`for\`, or \`if\` as variable names! Doing so causes a syntax error.
:::

:::remember Key Takeaway
Variables in Python do not need type declarations. Python detects the type dynamically at runtime.
:::

:::deep Under the Hood
In CPython, variable names are mapped to pointers pointing to Python object structures in heap memory.
:::

### 3. Collapsible Solution Block

:::solution Click to reveal the temperature converter solution
Here is the clean implementation:

\`\`\`python
def to_fahrenheit(celsius):
    return (celsius * 9/5) + 32
\`\`\`

You can call it with:
\`\`\`output
32.0
212.0
\`\`\`
:::

### 4. Interactive Code Block & Output Block

\`\`\`python run
message = "Testing Markdown extensions"
print(message.upper())
\`\`\`
\`\`\`output
TESTING MARKDOWN EXTENSIONS
\`\`\`

### 5. Ordered and Bullet Lists

Numbered sequence of operations:
1. Parse raw text into structured tokens
2. Match container blocks and callout fences
3. Render safe React components with dark and light mode tokens

Key benefits:
- Zero external package dependencies
- Fast client and server rendering
- Seamless integration with system dark mode

### 6. Blockquotes

> "Simple is better than complex. Readability counts."
> — The Zen of Python, Tim Peters
`;

export default function TestMarkdownPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:py-16">
      <div className="mb-8 border-b border-border pb-4">
        <span className="font-mono text-xs text-muted uppercase tracking-wider">
          Verification
        </span>
        <h1 className="font-doto text-2xl font-bold tracking-tight text-foreground sm:text-3xl mt-1">
          MARKDOWN EXTENSIONS TEST
        </h1>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6 sm:p-8">
        <MarkdownView content={TEST_MARKDOWN} />
      </div>
    </div>
  );
}
