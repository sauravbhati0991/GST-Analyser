import { formatCurrency, safeVal, exportCSV, downloadFile } from '../utils/gemini';

function SummaryCard({ icon, label, value, colorClass, delay }) {
  return (
    <div
      className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/[0.12] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[0.7rem] font-semibold uppercase tracking-wider text-gray-500">{label}</span>
        <span className="block text-base font-bold mt-0.5">{value}</span>
      </div>
    </div>
  );
}

function PartyCard({ title, icon, name, gstin, address, delay }) {
  return (
    <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm hover:border-white/[0.12] transition-all animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="flex items-center gap-2 text-sm font-semibold mb-4">
        {icon} {title}
      </h3>
      <div className="space-y-2.5">
        <div className="flex gap-4">
          <span className="text-xs text-gray-500 font-medium min-w-[60px]">Name</span>
          <span className="text-sm">{name}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-xs text-gray-500 font-medium min-w-[60px]">GSTIN</span>
          <span className="text-sm font-mono text-indigo-400">{gstin}</span>
        </div>
        <div className="flex gap-4">
          <span className="text-xs text-gray-500 font-medium min-w-[60px]">Address</span>
          <span className="text-sm break-words">{address}</span>
        </div>
      </div>
    </div>
  );
}

export default function Results({ result, onNewScan }) {
  if (!result) return null;

  const ts = result.taxSummary || {};
  const items = result.items || [];

  const handleExportCSV = () => {
    const csv = exportCSV(result);
    const invoiceNo = result.invoice?.number || 'bill';
    downloadFile(csv, `GST_${invoiceNo}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportJSON = () => {
    const invoiceNo = result.invoice?.number || 'bill';
    downloadFile(JSON.stringify(result, null, 2), `GST_${invoiceNo}.json`, 'application/json');
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-1">Analysis Results</h2>
        <div className="flex gap-2 mt-3 flex-wrap">
          <button onClick={handleExportCSV} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-xs font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            Export CSV
          </button>
          <button onClick={handleExportJSON} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.06] text-gray-400 hover:text-white hover:bg-white/[0.04] transition-all text-xs font-medium">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            Export JSON
          </button>
          <button onClick={onNewScan} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium text-xs shadow-md hover:shadow-lg transition-all">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Scan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          delay={50}
          label="Invoice No."
          value={safeVal(result.invoice?.number)}
          colorClass="bg-indigo-500/10 text-indigo-400"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        />
        <SummaryCard
          delay={100}
          label="Date"
          value={safeVal(result.invoice?.date)}
          colorClass="bg-blue-500/10 text-blue-400"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
        />
        <SummaryCard
          delay={150}
          label="Total Amount"
          value={result.invoice?.totalAmount != null ? `₹${formatCurrency(result.invoice.totalAmount)}` : '—'}
          colorClass="bg-green-500/10 text-green-400"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
        />
        <SummaryCard
          delay={200}
          label="Total Tax"
          value={result.invoice?.totalTax != null ? `₹${formatCurrency(result.invoice.totalTax)}` : '—'}
          colorClass="bg-amber-500/10 text-amber-400"
          icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>}
        />
      </div>

      {/* Seller & Buyer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PartyCard
          delay={250}
          title="Seller Details"
          name={safeVal(result.seller?.name)}
          gstin={safeVal(result.seller?.gstin)}
          address={safeVal(result.seller?.address)}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
        />
        <PartyCard
          delay={300}
          title="Buyer Details"
          name={safeVal(result.buyer?.name)}
          gstin={safeVal(result.buyer?.gstin)}
          address={safeVal(result.buyer?.address)}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
        />
      </div>

      {/* Products Table */}
      <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 5v5a1 1 0 0 1-1 1h-1" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
          Product / Service Details
        </h3>
        <div className="overflow-x-auto rounded-lg border border-white/[0.06]">
          <table className="w-full text-[0.8rem]">
            <thead>
              <tr className="bg-white/[0.02]">
                {['#', 'Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate (₹)', 'Taxable (₹)', 'GST %', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)', 'Total (₹)'].map((h) => (
                  <th key={h} className="text-left px-3 py-2.5 text-[0.68rem] font-semibold uppercase tracking-wider text-gray-500 whitespace-nowrap border-b border-white/[0.06]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-white/[0.015] transition-colors border-b border-white/[0.04] last:border-b-0">
                  <td className="px-3 py-2.5">{i + 1}</td>
                  <td className="px-3 py-2.5 min-w-[180px] whitespace-normal">{safeVal(item.description)}</td>
                  <td className="px-3 py-2.5 whitespace-nowrap">{safeVal(item.hsnSac)}</td>
                  <td className="px-3 py-2.5">{safeVal(item.quantity)}</td>
                  <td className="px-3 py-2.5">{safeVal(item.unit)}</td>
                  <td className="px-3 py-2.5">{item.rate != null ? formatCurrency(item.rate) : '—'}</td>
                  <td className="px-3 py-2.5">{item.taxableAmount != null ? formatCurrency(item.taxableAmount) : '—'}</td>
                  <td className="px-3 py-2.5">{item.gstRate != null ? `${item.gstRate}%` : '—'}</td>
                  <td className="px-3 py-2.5">{item.cgst != null ? formatCurrency(item.cgst) : '—'}</td>
                  <td className="px-3 py-2.5">{item.sgst != null ? formatCurrency(item.sgst) : '—'}</td>
                  <td className="px-3 py-2.5">{item.igst != null ? formatCurrency(item.igst) : '—'}</td>
                  <td className="px-3 py-2.5 font-semibold">{item.totalAmount != null ? formatCurrency(item.totalAmount) : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-white/[0.1] bg-indigo-500/[0.03]">
                <td colSpan="6" className="px-3 py-2.5 text-right font-semibold">Totals</td>
                <td className="px-3 py-2.5 font-bold">{ts.totalTaxableAmount != null ? formatCurrency(ts.totalTaxableAmount) : '—'}</td>
                <td className="px-3 py-2.5"></td>
                <td className="px-3 py-2.5 font-bold">{ts.totalCGST != null ? formatCurrency(ts.totalCGST) : '—'}</td>
                <td className="px-3 py-2.5 font-bold">{ts.totalSGST != null ? formatCurrency(ts.totalSGST) : '—'}</td>
                <td className="px-3 py-2.5 font-bold">{ts.totalIGST != null ? formatCurrency(ts.totalIGST) : '—'}</td>
                <td className="px-3 py-2.5 font-bold">{ts.grandTotal != null ? `₹${formatCurrency(ts.grandTotal)}` : '—'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '450ms' }}>
        <h3 className="flex items-center gap-2 text-sm font-semibold mb-4">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
          Tax Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <TaxItem label="Taxable Amount" value={ts.totalTaxableAmount} color="text-blue-400" />
          <TaxItem label="CGST" value={ts.totalCGST} color="text-purple-400" />
          <TaxItem label="SGST" value={ts.totalSGST} color="text-purple-400" />
          <TaxItem label="IGST" value={ts.totalIGST} color="text-amber-400" />
          {ts.totalCess != null && <TaxItem label="Cess" value={ts.totalCess} color="text-amber-400" />}
          {ts.roundOff != null && <TaxItem label="Round Off" value={ts.roundOff} color="text-gray-300" />}
          <TaxItem label="Grand Total" value={ts.grandTotal} color="text-green-400" />
        </div>
      </div>
    </div>
  );
}

function TaxItem({ label, value, color }) {
  return (
    <div className="p-3.5 bg-white/[0.015] border border-white/[0.06] rounded-lg">
      <div className="text-[0.68rem] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className={`text-lg font-bold mt-1 ${color}`}>
        {value != null ? `₹${formatCurrency(value)}` : '—'}
      </div>
    </div>
  );
}
