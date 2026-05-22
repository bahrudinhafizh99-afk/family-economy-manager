import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Transaction } from '../types';

// Extend jsPDF type to include autoTable
interface ExtendedjsPDF extends jsPDF {
  autoTable: (options: any) => void;
}

export const exportToPDF = (
  transactions: Transaction[], 
  income: number,
  expense: number,
  balance: number,
  language: 'id' | 'en' = 'id'
) => {
  const isID = language === 'id';
  const doc = new jsPDF() as ExtendedjsPDF;
  const date = new Date().toLocaleDateString(isID ? 'id-ID' : 'en-US');

  // Title
  doc.setFontSize(22);
  doc.setTextColor(255, 180, 153); // Primary Color
  doc.text(isID ? 'Laporan Keuangan Keluarga' : 'Family Financial Report', 14, 22);
  
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`${isID ? 'Dicetak pada' : 'Printed on'}: ${date}`, 14, 30);

  // Summary Boxes
  doc.setDrawColor(240);
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(14, 38, 55, 25, 3, 3, 'FD');
  doc.roundedRect(77, 38, 55, 25, 3, 3, 'FD');
  doc.roundedRect(140, 38, 55, 25, 3, 3, 'FD');

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text(isID ? 'TOTAL PEMASUKAN' : 'TOTAL INCOME', 18, 45);
  doc.text(isID ? 'TOTAL PENGELUARAN' : 'TOTAL EXPENSE', 81, 45);
  doc.text(isID ? 'SALDO AKHIR' : 'TOTAL BALANCE', 144, 45);

  doc.setFontSize(12);
  doc.setTextColor(46, 125, 50); // Green
  doc.text(`Rp ${income.toLocaleString('id-ID')}`, 18, 54);
  doc.setTextColor(211, 47, 47); // Red
  doc.text(`Rp ${expense.toLocaleString('id-ID')}`, 81, 54);
  doc.setTextColor(40); // Blackish
  doc.text(`Rp ${balance.toLocaleString('id-ID')}`, 144, 54);

  // Table
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString(isID ? 'id-ID' : 'en-US'),
    t.type === 'income' ? (isID ? 'Pemasukan' : 'Income') : (isID ? 'Pengeluaran' : 'Expense'),
    t.category,
    t.description || '-',
    `Rp ${t.amount.toLocaleString('id-ID')}`
  ]);

  doc.autoTable({
    startY: 75,
    head: [[
      isID ? 'Tanggal' : 'Date', 
      isID ? 'Tipe' : 'Type', 
      isID ? 'Kategori' : 'Category', 
      isID ? 'Catatan' : 'Note', 
      isID ? 'Jumlah' : 'Amount'
    ]],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [255, 180, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    margin: { top: 75 },
  });

  doc.save(isID ? `Laporan_Keuangan_${date.replace(/\//g, '-')}.pdf` : `Financial_Report_${date.replace(/\//g, '-')}.pdf`);
};

export const exportToCSV = (transactions: Transaction[], language: 'id' | 'en' = 'id') => {
  const isID = language === 'id';
  const headers = isID 
    ? ['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Jumlah']
    : ['Date', 'Type', 'Category', 'Note', 'Amount'];
    
  const csvRows = [headers.join(',')];

  for (const t of transactions) {
    const row = [
      new Date(t.date).toLocaleDateString(isID ? 'id-ID' : 'en-US'),
      t.type === 'income' ? (isID ? 'Pemasukan' : 'Income') : (isID ? 'Pengeluaran' : 'Expense'),
      t.category,
      `"${(t.description || '-').replace(/"/g, '""')}"`,
      t.amount
    ];
    csvRows.push(row.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toLocaleDateString(isID ? 'id-ID' : 'en-US').replace(/\//g, '-');
  
  link.href = url;
  link.download = isID ? `Laporan_Keuangan_${date}.csv` : `Financial_Report_${date}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};
