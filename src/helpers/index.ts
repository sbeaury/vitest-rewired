import { userEvent } from "vitest/browser";
import { page } from "@vitest/browser/context";

// Basic user actions
export const actions = {
    click: userEvent.click,
    type: userEvent.type,
    clear: userEvent.clear,
    selectOptions: userEvent.selectOptions,
    fill: userEvent.fill,
};

// Form interaction helpers
export const form = {
    /**
     * Fill an input field by label text
     */
    async fillByLabel(labelText: string, value: string) {
        const input = page.getByLabelText(labelText);
        await actions.fill(input, value);
    },

    /**
     * Fill an input field by placeholder
     */
    async fillByPlaceholder(placeholder: string, value: string) {
        const input = page.getByPlaceholder(placeholder);
        await actions.fill(input, value);
    },

    /**
     * Select option(s) from a select element by label
     */
    async selectByLabel(labelText: string, value: string | string[]) {
        const select = page.getByLabelText(labelText);
        await actions.selectOptions(select, value);
    },

    /**
     * Check or uncheck a checkbox by label
     */
    async toggleCheckbox(labelText: string, checked: boolean) {
        const checkbox = page.getByLabelText(labelText);
        const element = checkbox.element() as HTMLInputElement;
        if (element.checked !== checked) {
            await actions.click(checkbox);
        }
    },

    /**
     * Click a radio button by label
     */
    async selectRadio(labelText: string) {
        const radio = page.getByLabelText(labelText);
        await actions.click(radio);
    },

    /**
     * Submit a form by clicking its submit button
     */
    async submit(buttonText = "Submit") {
        const button = page.getByRole("button", { name: buttonText });
        await actions.click(button);
    },

    /**
     * Get all form data as an object
     */
    getData(formSelector: string): Record<string, string | string[]> {
        const formElement = document.querySelector(formSelector) as HTMLFormElement;
        if (!formElement) {
            throw new Error(`Form not found: ${formSelector}`);
        }

        const formData = new FormData(formElement);
        const data: Record<string, string | string[]> = {};

        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                // Handle multiple values (checkboxes with same name)
                if (Array.isArray(data[key])) {
                    (data[key] as string[]).push(value.toString());
                } else {
                    data[key] = [data[key] as string, value.toString()];
                }
            } else {
                data[key] = value.toString();
            }
        }

        return data;
    },
};

// Table querying helpers
export const table = {
    /**
     * Get all rows from a table (excluding header)
     */
    getRows(tableSelector: string): HTMLTableRowElement[] {
        const tableElement = document.querySelector(tableSelector) as HTMLTableElement;
        if (!tableElement) {
            throw new Error(`Table not found: ${tableSelector}`);
        }

        return Array.from(tableElement.querySelectorAll("tbody tr"));
    },

    /**
     * Get a specific row by index (0-based)
     */
    getRow(tableSelector: string, index: number): HTMLTableRowElement | null {
        const rows = this.getRows(tableSelector);
        return rows[index] || null;
    },

    /**
     * Get all cells in a specific row
     */
    getRowCells(row: HTMLTableRowElement): string[] {
        return Array.from(row.querySelectorAll("td")).map(cell => cell.textContent?.trim() || "");
    },

    /**
     * Get all data from a table as an array of objects
     * Uses header row for keys
     */
    getData(tableSelector: string): Record<string, string>[] {
        const tableElement = document.querySelector(tableSelector) as HTMLTableElement;
        if (!tableElement) {
            throw new Error(`Table not found: ${tableSelector}`);
        }

        const headers = Array.from(tableElement.querySelectorAll("thead th")).map(
            th => th.textContent?.trim() || ""
        );

        const rows = this.getRows(tableSelector);

        return rows.map(row => {
            const cells = this.getRowCells(row);
            const rowData: Record<string, string> = {};

            headers.forEach((header, index) => {
                rowData[header] = cells[index] || "";
            });

            return rowData;
        });
    },

    /**
     * Find rows where a specific column matches a value
     */
    findRows(tableSelector: string, columnName: string, value: string): Record<string, string>[] {
        const data = this.getData(tableSelector);
        return data.filter(row => row[columnName] === value);
    },

    /**
     * Get a specific cell value by row index and column name
     */
    getCellValue(tableSelector: string, rowIndex: number, columnName: string): string | null {
        const data = this.getData(tableSelector);
        return data[rowIndex]?.[columnName] || null;
    },

    /**
     * Get all values from a specific column
     */
    getColumnValues(tableSelector: string, columnName: string): string[] {
        const data = this.getData(tableSelector);
        return data.map(row => row[columnName] || "");
    },

    /**
     * Click a button or link within a specific row
     */
    async clickInRow(tableSelector: string, rowIndex: number, buttonText: string) {
        const row = this.getRow(tableSelector, rowIndex);
        if (!row) {
            throw new Error(`Row ${rowIndex} not found`);
        }

        const button = Array.from(row.querySelectorAll("button, a")).find(
            el => el.textContent?.trim() === buttonText
        );

        if (!button) {
            throw new Error(`Button "${buttonText}" not found in row ${rowIndex}`);
        }

        await userEvent.click(button);
    },
};