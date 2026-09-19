import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const getCategoryName = (operation) =>
    operation?.category?.name_ar ||
    operation?.category?.name_en ||
    "—";

const getTypeName = (operation) =>
    operation?.type === "income" ? "Income" : "Expense";

const getDate = (operation) => {
    const value =
        operation?.operation_date ||
        operation?.created_at;

    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleDateString();
};

const normalizeOperations = (data) =>
    data.map((operation) => ({
        Date: getDate(operation),
        Type: getTypeName(operation),
        Category: getCategoryName(operation),
        Amount: Number(operation?.amount || 0).toFixed(2),
        Notes: operation?.description || "—",
    }));

export const exportToExcel = (
    data,
    filename = "operations"
) => {
    if (!Array.isArray(data) || data.length === 0) {
        return;
    }

    const rows = normalizeOperations(data);
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Operations"
    );

    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (
    data,
    filename = "operations"
) => {
    if (!Array.isArray(data) || data.length === 0) {
        return;
    }

    const doc = new jsPDF("landscape", "mm", "a4");

    const columns = [
        "Date",
        "Type",
        "Category",
        "Amount",
        "Notes",
    ];

    const rows = data.map((operation) => [
        getDate(operation),
        getTypeName(operation),
        getCategoryName(operation),
        Number(operation?.amount || 0).toFixed(2),
        operation?.description || "—",
    ]);

    autoTable(doc, {
        head: [columns],
        body: rows,
        theme: "grid",
        styles: {
            fontSize: 8,
            cellPadding: 3,
        },
        headStyles: {
            fillColor: [37, 99, 235],
        },
    });

    doc.save(`${filename}.pdf`);
};

export const exportToCSV = (
    data,
    filename = "operations"
) => {
    if (!Array.isArray(data) || data.length === 0) {
        return;
    }

    const rows = normalizeOperations(data);

    const headers = Object.keys(rows[0]);

    const escapeCSV = (value) => {
        const text = String(value ?? "");

        return `"${text.replace(/"/g, '""')}"`;
    };

    const csvContent = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) =>
            headers.map((header) =>
                escapeCSV(row[header])
            ).join(",")
        ),
    ].join("\n");

    const blob = new Blob(
        [csvContent],
        {
            type: "text/csv;charset=utf-8;",
        }
    );

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
};