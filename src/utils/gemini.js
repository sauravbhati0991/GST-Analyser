const GEMINI_API_KEY = 'AIzaSyCfGCI_Ury9KJAJXBJwh5Ilqq1uIF8i4CY';

const GEMINI_PROMPT = `You are an expert GST bill/invoice parser. Analyze this Indian GST bill image and extract ALL information in the following strict JSON structure. Be thorough and accurate. If a field is not found, use null.

Return ONLY valid JSON (no markdown, no code fences):

{
  "invoice": {
    "number": "string",
    "date": "string (DD/MM/YYYY)",
    "placeOfSupply": "string",
    "reverseCharge": "Yes/No",
    "totalAmount": "number",
    "totalTax": "number",
    "amountInWords": "string"
  },
  "seller": {
    "name": "string",
    "gstin": "string (15-char)",
    "address": "string",
    "state": "string",
    "stateCode": "string"
  },
  "buyer": {
    "name": "string",
    "gstin": "string (15-char)",
    "address": "string",
    "state": "string",
    "stateCode": "string"
  },
  "items": [
    {
      "description": "string",
      "hsnSac": "string",
      "quantity": "number",
      "unit": "string",
      "rate": "number",
      "taxableAmount": "number",
      "gstRate": "number (percentage)",
      "cgst": "number",
      "sgst": "number",
      "igst": "number",
      "totalAmount": "number"
    }
  ],
  "taxSummary": {
    "totalTaxableAmount": "number",
    "totalCGST": "number",
    "totalSGST": "number",
    "totalIGST": "number",
    "totalCess": "number",
    "roundOff": "number",
    "grandTotal": "number"
  }
}`;

const MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash-lite',
  'gemini-2.0-flash',
];

export async function analyseWithGemini(base64Data, mimeType) {
  const base64Content = base64Data.split(',')[1];

  const payload = {
    contents: [{
      parts: [
        { text: GEMINI_PROMPT },
        {
          inlineData: {
            mimeType,
            data: base64Content,
          },
        },
      ],
    }],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
    },
  };

  let lastError = null;

  for (const model of MODELS) {
    try {
      console.log(`Trying model: ${model}...`);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        const msg = err.error?.message || `API error: ${response.status}`;
        console.warn(`Model ${model} failed: ${msg}`);
        lastError = msg;
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        lastError = `No response from ${model}`;
        continue;
      }

      console.log(`Success with model: ${model}`);

      let cleaned = text.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      return JSON.parse(cleaned);
    } catch (err) {
      console.warn(`Model ${model} error:`, err.message);
      lastError = err.message;
      continue;
    }
  }

  throw new Error(lastError || 'All models failed. Please try again later.');
}

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
