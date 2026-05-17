import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Transaction } from '../types';

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
