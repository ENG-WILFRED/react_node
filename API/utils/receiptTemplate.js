// src/services/receiptService.js
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateReceiptPDF = (transaction, user) => {
  const doc = new PDFDocument({ margin: 50 });

  const receiptPath = path.join('receipts', `receipt-${transaction.id}.pdf`);
  const writeStream = fs.createWriteStream(receiptPath);
  doc.pipe(writeStream);

  // Header
  doc
    .fontSize(20)
    .text('Transaction Receipt', { align: 'center' })
    .moveDown();

  // User Info
  doc
    .fontSize(12)
    .text(`Sender: ${user.name}`, { continued: true })
    .text(` (${user.email})`)
    .moveDown();

  // Transaction Info
  doc
    .text(`Transaction ID: ${transaction.id}`)
    .text(`Recipient: ${transaction.recipient}`)
    .text(`Amount: ${transaction.amount} ${transaction.currency}`)
    .text(`Date: ${new Date(transaction.timestamp).toLocaleString()}`)
    .moveDown();

  // Footer
  doc
    .fontSize(10)
    .text('Thank you for using our service.', { align: 'center' });

  doc.end();

  return new Promise((resolve, reject) => {
    writeStream.on('finish', () => resolve(receiptPath));
    writeStream.on('error', reject);
  });
};
