import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import type { Transaction } from '../types';

// Extend jsPDF type to include autoTable
interface ExtendedjsPDF extends jsPDF {
  autoTable: (options: any) => void;
}

export const exportToPDF = (transactions: Transaction[], balance: number) => {
  const doc = new jsPDF() as ExtendedjsPDF;
  const date = new Date().toLocaleDateString('id-ID');

  // Title
  doc.setFontSize(18);
  doc.text('Laporan Keuangan Keluarga', 14, 20);
  
  doc.setFontSize(11);
  doc.text(`Tanggal Cetak: ${date}`, 14, 30);
  doc.text(`Total Saldo Saat Ini: Rp ${balance.toLocaleString('id-ID')}`, 14, 38);

  // Table
  const tableData = transactions.map(t => [
    new Date(t.date).toLocaleDateString('id-ID'),
    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    t.category,
    t.description || '-',
    `Rp ${t.amount.toLocaleString('id-ID')}`
  ]);

  doc.autoTable({
    startY: 45,
    head: [['Tanggal', 'Tipe', 'Kategori', 'Catatan', 'Jumlah']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [255, 180, 153] }, // Primary color
  });

  doc.save(`Laporan_Keuangan_${date.replace(/\//g, '-')}.pdf`);
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
