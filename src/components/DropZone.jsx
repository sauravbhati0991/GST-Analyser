import { useCallback } from 'react';

export default function DropZone({ onFileSelect }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-indigo-500', 'shadow-[0_0_40px_rgba(99,102,241,0.15)]');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'shadow-[0_0_40px_rgba(99,102,241,0.15)]');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-indigo-500', 'shadow-[0_0_40px_rgba(99,102,241,0.15)]');
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) onFileSelect(file);
    };
    input.click();
  }, [onFileSelect]);

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative border-2 border-dashed border-white/[0.06] rounded-3xl p-10 sm:p-14 text-center cursor-pointer bg-white/[0.02] hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.15)] transition-all duration-300 group"
    >
      {/* Icon */}
      <div className="text-gray-600 mb-4 transition-all duration-300 group-hover:text-indigo-500 group-hover:-translate-y-1">
        <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path d="M32 20v16m-6-6l6 6 6-6" stroke="url(#ug)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="12" y="42" width="40" height="6" rx="2" fill="currentColor" opacity="0.08" />
          <defs>
            <linearGradient id="ug" x1="26" y1="20" x2="38" y2="36">
              <stop stopColor="#6366f1" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <p className="text-base sm:text-lg font-semibold text-white mb-1">Drag & drop your bill here</p>
      <p className="text-sm text-gray-500 mb-4">or click to browse files</p>

      <div className="flex gap-2 justify-center flex-wrap">
        {['JPG', 'PNG', 'PDF', 'WEBP'].map((f) => (
          <span key={f} className="text-[0.7rem] font-semibold tracking-wide text-gray-500 bg-white/[0.03] border border-white/[0.06] px-3 py-0.5 rounded-full">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
