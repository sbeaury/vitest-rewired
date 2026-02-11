# vitest-rewired

Helpful utilities for Vitest browser mode.

## Installation

```bash
pnpm pack
pnpm add -D vitest-rewired
```

## Usage

## Actions

| Utility                 | Description                            | Example                                          |
| ----------------------- | -------------------------------------- | ------------------------------------------------ |
| `actions.click`         | Click an element                       | `await actions.click(page.getByRole('button'))`  |
| `actions.type`          | Type text into an element              | `await actions.type(input, 'Hello')`             |
| `actions.clear`         | Clear an input field                   | `await actions.clear(input)`                     |
| `actions.selectOptions` | Select option(s) from a select element | `await actions.selectOptions(select, 'option1')` |
| `actions.fill`          | Fill an input field with a value       | `await actions.fill(input, 'value')`             |

## Form Utilities

| Utility                  | Description                             | Example                                               |
| ------------------------ | --------------------------------------- | ----------------------------------------------------- |
| `form.fillByLabel`       | Fill an input field by its label text   | `await form.fillByLabel('Email', 'user@example.com')` |
| `form.fillByPlaceholder` | Fill an input field by its placeholder  | `await form.fillByPlaceholder('Enter name', 'John')`  |
| `form.selectByLabel`     | Select option(s) from a select by label | `await form.selectByLabel('Country', 'USA')`          |
| `form.toggleCheckbox`    | Check or uncheck a checkbox by label    | `await form.toggleCheckbox('Accept terms', true)`     |
| `form.selectRadio`       | Click a radio button by label           | `await form.selectRadio('Option A')`                  |
| `form.submit`            | Submit a form by clicking submit button | `await form.submit()` or `await form.submit('Save')`  |
| `form.getData`           | Get all form data as an object          | `const data = form.getData('#myForm')`                |

## Table Utilities

| Utility                 | Description                                  | Example                                                   |
| ----------------------- | -------------------------------------------- | --------------------------------------------------------- |
| `table.getRows`         | Get all rows from a table (excluding header) | `const rows = table.getRows('#myTable')`                  |
| `table.getRow`          | Get a specific row by index (0-based)        | `const row = table.getRow('#myTable', 0)`                 |
| `table.getRowCells`     | Get all cell values in a specific row        | `const cells = table.getRowCells(row)`                    |
| `table.getData`         | Get all table data as array of objects       | `const data = table.getData('#myTable')`                  |
| `table.findRows`        | Find rows where column matches value         | `const rows = table.findRows('#myTable', 'Name', 'John')` |
| `table.getCellValue`    | Get cell value by row index and column name  | `const val = table.getCellValue('#myTable', 0, 'Email')`  |
| `table.getColumnValues` | Get all values from a specific column        | `const names = table.getColumnValues('#myTable', 'Name')` |
| `table.clickInRow`      | Click a button/link within a specific row    | `await table.clickInRow('#myTable', 0, 'Edit')`           |

## Usage Examples

### Form Testing

```typescript
import { form } from "vitest-rewired";

test("should fill and submit form", async () => {
  await form.fillByLabel("Username", "testuser");
  await form.fillByLabel("Password", "password123");
  await form.toggleCheckbox("Remember me", true);
  await form.submit();

  const formData = form.getData("#loginForm");
  expect(formData.username).toBe("testuser");
});
```

### Table Testing

```typescript
import { table } from "vitest-rewired";

test("should verify table data", async () => {
  const data = table.getData("#usersTable");
  expect(data).toHaveLength(3);

  const johns = table.findRows("#usersTable", "Name", "John");
  expect(johns).toHaveLength(1);

  await table.clickInRow("#usersTable", 0, "Delete");
});
```

### Action Testing

```typescript
import { actions } from "vitest-rewired";
import { page } from "@vitest/browser/context";

test("should perform basic actions", async () => {
  await actions.click(page.getByRole("button", { name: "Open" }));
  await actions.type(page.getByPlaceholder("Search"), "query");
  await actions.clear(page.getByPlaceholder("Search"));
});
```

## Requirements

- Vitest >= 2.0.0
- Browser mode enabled in your Vitest config

## License

MIT
