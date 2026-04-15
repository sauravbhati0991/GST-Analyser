import { useCallback } from 'react';

export default function DropZone({ onFileSelect }) {
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-accent', 'bg-accent/5');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-accent', 'bg-accent/5');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-accent', 'bg-accent/5');
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
      className="relative border-2 border-dashed border-accent/20 rounded-3xl p-10 sm:p-14 text-center cursor-pointer bg-accent/[0.03] shadow-green hover:border-accent hover:bg-accent/[0.06] hover:shadow-lg transition-all duration-300 group"
    >
      {/* Icon */}
      <div className="text-accent/60 mb-4 transition-all duration-300 group-hover:text-accent group-hover:-translate-y-1">
        <svg className="w-16 h-16 mx-auto" viewBox="0 0 64 64" fill="none">
          <rect x="8" y="12" width="48" height="40" rx="4" stroke="currentColor" strokeWidth="2.5" />
          <path d="M32 20v16m-6-6l6 6 6-6" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="12" y="42" width="40" height="6" rx="2" fill="currentColor" opacity="0.1" />
        </svg>
      </div>

      <p className="text-lg sm:text-xl font-bold text-text-primary mb-2 uppercase tracking-wide">Drag & drop your GST bill here</p>
      <p className="text-sm text-text-secondary mb-8 font-medium italic">or click to browse local files</p>

      <div className="flex gap-2.5 justify-center flex-wrap">
        {['JPG', 'PNG', 'PDF', 'WEBP'].map((f) => (
          <span key={f} className="text-[0.75rem] font-black tracking-widest text-accent bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
