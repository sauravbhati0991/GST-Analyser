import { formatCurrency, safeVal, exportCSV, downloadFile } from '../utils/gemini';

function SummaryCard({ icon, label, value, colorClass, delay }) {
  return (
    <div
      className="flex items-center gap-4 p-5 bg-bg-secondary border border-accent/20 rounded-2xl shadow-green hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[0.7rem] font-black uppercase tracking-widest text-accent/60">{label}</span>
        <span className="block text-xl font-black text-text-primary mt-0.5">{value}</span>
      </div>
    </div>
  );
}

function PartyCard({ title, icon, name, gstin, address, delay }) {
  return (
    <div className="p-6 bg-bg-secondary border border-border-light rounded-2xl shadow-soft hover:shadow-lg transition-all animate-fade-in-up" style={{ animationDelay: `${delay}ms` }}>
      <h3 className="flex items-center gap-2 text-base font-bold text-text-primary mb-5">
        {icon} {title}
      </h3>
      <div className="space-y-3.5">
        <div className="flex gap-4 items-start">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider min-w-[70px] mt-1">Name</span>
          <span className="text-sm font-semibold text-text-primary">{name}</span>
        </div>
        <div className="flex gap-4 items-start">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider min-w-[70px] mt-1">GSTIN</span>
          <span className="text-sm font-bold font-mono text-accent">{gstin}</span>
        </div>
        <div className="flex gap-4 items-start">
          <span className="text-xs text-text-secondary font-bold uppercase tracking-wider min-w-[70px] mt-1">Address</span>
          <span className="text-sm font-medium text-text-primary leading-relaxed">{address}</span>
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-text-primary">Analysis Results</h2>
          <p className="text-sm text-text-secondary mt-1">Successfully extracted data from the document</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-light bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-accent/40 shadow-sm transition-all text-xs font-bold uppercase tracking-wider">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
            Export CSV
          </button>
          <button onClick={handleExportJSON} className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border-light bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-accent/40 shadow-sm transition-all text-xs font-bold uppercase tracking-wider">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            Export JSON
          </button>
          <button onClick={onNewScan} className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent text-white font-bold text-xs shadow-md hover:bg-accent-hover hover:-translate-y-0.5 transition-all uppercase tracking-wider">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            New Scan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <SummaryCard
          delay={50}
          label="Invoice No."
          value={safeVal(result.invoice?.number)}
          colorClass="bg-[#E7E9FB] text-[#422AFB]"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>}
        />
        <SummaryCard
          delay={100}
          label="Date"
          value={safeVal(result.invoice?.date)}
          colorClass="bg-[#E5F9FD] text-[#01B9DB]"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>}
        />
        <SummaryCard
          delay={150}
          label="Total Amount"
          value={result.invoice?.totalAmount != null ? `₹${formatCurrency(result.invoice.totalAmount)}` : '—'}
          colorClass="bg-[#E7F7EF] text-accent"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>}
        />
        <SummaryCard
          delay={200}
          label="Total Tax"
          value={result.invoice?.totalTax != null ? `₹${formatCurrency(result.invoice.totalTax)}` : '—'}
          colorClass="bg-[#FFF8E7] text-[#FFB547]"
          icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h10" /></svg>}
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
      <div className="p-6 bg-bg-secondary border border-accent/20 rounded-2xl shadow-green animate-fade-in-up" style={{ animationDelay: '350ms' }}>
        <h3 className="flex items-center gap-2 text-base font-black text-accent mb-6 uppercase tracking-wider">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 5v5a1 1 0 0 1-1 1h-1" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>
          Detailed Item Breakdown
        </h3>
        <div className="overflow-x-auto rounded-xl border border-accent/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-accent/[0.04]">
                {['#', 'Description', 'HSN/SAC', 'Qty', 'Unit', 'Rate (₹)', 'Taxable (₹)', 'GST %', 'CGST (₹)', 'SGST (₹)', 'IGST (₹)', 'Total (₹)'].map((h) => (
                  <th key={h} className="text-left px-4 py-4 text-[0.68rem] font-black uppercase tracking-widest text-accent whitespace-nowrap border-b border-accent/10">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="hover:bg-accent/[0.02] transition-colors border-b border-accent/5 last:border-b-0">
                  <td className="px-4 py-3.5 text-text-secondary font-bold text-xs">{i + 1}</td>
                  <td className="px-4 py-3.5 min-w-[200px] whitespace-normal font-bold text-text-primary">{safeVal(item.description)}</td>
                  <td className="px-4 py-3.5 whitespace-nowrap text-accent font-black font-mono text-xs">{safeVal(item.hsnSac)}</td>
                  <td className="px-4 py-3.5 font-bold text-text-primary">{safeVal(item.quantity)}</td>
                  <td className="px-4 py-3.5 text-text-secondary font-bold text-xs">{safeVal(item.unit)}</td>
                  <td className="px-4 py-3.5 font-bold">{item.rate != null ? formatCurrency(item.rate) : '—'}</td>
                  <td className="px-4 py-3.5 font-bold">{item.taxableAmount != null ? formatCurrency(item.taxableAmount) : '—'}</td>
                  <td className="px-4 py-3.5 font-black text-accent bg-accent/5">{item.gstRate != null ? `${item.gstRate}%` : '—'}</td>
                  <td className="px-4 py-3.5 font-bold text-text-secondary">{item.cgst != null ? formatCurrency(item.cgst) : '—'}</td>
                  <td className="px-4 py-3.5 font-bold text-text-secondary">{item.sgst != null ? formatCurrency(item.sgst) : '—'}</td>
                  <td className="px-4 py-3.5 font-bold text-text-secondary">{item.igst != null ? formatCurrency(item.igst) : '—'}</td>
                  <td className="px-4 py-3.5 font-black text-text-primary">{item.totalAmount != null ? formatCurrency(item.totalAmount) : '—'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-border-light bg-accent/5">
                <td colSpan="6" className="px-4 py-4 text-right font-bold text-text-secondary uppercase tracking-wider text-xs">Totals</td>
                <td className="px-4 py-4 font-extrabold text-text-primary underline decoration-accent/30 underline-offset-4">{ts.totalTaxableAmount != null ? formatCurrency(ts.totalTaxableAmount) : '—'}</td>
                <td className="px-4 py-4"></td>
                <td className="px-4 py-4 font-extrabold text-text-primary">{ts.totalCGST != null ? formatCurrency(ts.totalCGST) : '—'}</td>
                <td className="px-4 py-4 font-extrabold text-text-primary">{ts.totalSGST != null ? formatCurrency(ts.totalSGST) : '—'}</td>
                <td className="px-4 py-4 font-extrabold text-text-primary">{ts.totalIGST != null ? formatCurrency(ts.totalIGST) : '—'}</td>
                <td className="px-4 py-4 font-black text-accent text-base">₹{ts.grandTotal != null ? formatCurrency(ts.grandTotal) : '—'}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Tax Breakdown */}
      <div className="p-6 bg-bg-secondary border border-border-light rounded-2xl shadow-soft animate-fade-in-up" style={{ animationDelay: '450ms' }}>
        <h3 className="flex items-center gap-2 text-base font-bold text-text-primary mb-5">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
          Tax Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <TaxItem label="Taxable Amount" value={ts.totalTaxableAmount} color="text-[#422AFB]" gradient="bg-[#E7E9FB]" />
          <TaxItem label="CGST" value={ts.totalCGST} color="text-[#843CFB]" gradient="bg-[#F2E7FB]" />
          <TaxItem label="SGST" value={ts.totalSGST} color="text-[#843CFB]" gradient="bg-[#F2E7FB]" />
          <TaxItem label="IGST" value={ts.totalIGST} color="text-[#FFB547]" gradient="bg-[#FFF8E7]" />
          {ts.totalCess != null && <TaxItem label="Cess" value={ts.totalCess} color="text-danger" gradient="bg-danger/10" />}
          {ts.roundOff != null && <TaxItem label="Round Off" value={ts.roundOff} color="text-text-secondary" gradient="bg-bg-primary" />}
          <TaxItem label="Grand Total" value={ts.grandTotal} color="text-accent" gradient="bg-accent/10" />
        </div>
      </div>
    </div>
  );
}

function TaxItem({ label, value, color, gradient }) {
  return (
    <div className={`p-5 rounded-2xl border border-border-light ${gradient}`}>
      <div className="text-[0.65rem] font-bold uppercase tracking-widest text-text-secondary">{label}</div>
      <div className={`text-xl font-black mt-1.5 ${color}`}>
        {value != null ? `₹${formatCurrency(value)}` : '—'}
      </div>
    </div>
  );
}
