// The analysis logic has been moved to the secure backend.
// These are UI formatting utilities used by the frontend components.

export function formatCurrency(val) {
  if (val === null || val === undefined) return '—';
  return Number(val).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function safeVal(val, fallback = '—') {
  return val !== null && val !== undefined && val !== '' ? val : fallback;
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function exportCSV(result) {
  const items = result.items || [];
  const headers = ['#', 'Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate', 'Taxable Amt', 'GST %', 'CGST', 'SGST', 'IGST', 'Total'];
  const escCsv = (val) => {
    const str = String(val ?? '');
    return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str.replace(/"/g, '""')}"` : str;
  };

  let csv = headers.join(',') + '\n';
  items.forEach((item, i) => {
    csv += [
      i + 1, escCsv(item.description), escCsv(item.hsnSac),
      item.quantity ?? '', escCsv(item.unit), item.rate ?? '',
      item.taxableAmount ?? '', item.gstRate != null ? item.gstRate + '%' : '',
      item.cgst ?? '', item.sgst ?? '', item.igst ?? '', item.totalAmount ?? '',
    ].join(',') + '\n';
  });

  const ts = result.taxSummary || {};
  csv += '\n';
  csv += `Invoice No.,${escCsv(result.invoice?.number)}\n`;
  csv += `Date,${escCsv(result.invoice?.date)}\n`;
  csv += `Seller,${escCsv(result.seller?.name)}\n`;
  csv += `Seller GSTIN,${escCsv(result.seller?.gstin)}\n`;
  csv += `Buyer,${escCsv(result.buyer?.name)}\n`;
  csv += `Buyer GSTIN,${escCsv(result.buyer?.gstin)}\n`;
  csv += `Grand Total,${ts.grandTotal ?? ''}\n`;

  return csv;
}

export function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
