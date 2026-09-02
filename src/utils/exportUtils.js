import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToExcel = (data, filename = 'operations') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Operations');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

export const exportToPDF = (data, filename = 'operations') => {
    if (!data || data.length === 0) {
        alert('No data to export');
        return;
    }

    const doc = new jsPDF('landscape', 'mm', 'a4');
    const tableColumn = ['ID', 'Customer', 'Type', 'Amount', 'Status', 'Date'];
    const tableRows = data.map(item => [
        item.id,
        item.customer?.name || 'N/A',
        item.type,
        Number(item.amount).toFixed(2),
        item.status,
        item.created_at ? new Date(item.created_at).toLocaleDateString() : '-',
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 41, 59] },
    });

    doc.save(`${filename}.pdf`);
};