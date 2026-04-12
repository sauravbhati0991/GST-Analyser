import { useState, useCallback } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import Preview from './components/Preview';
import LoadingState from './components/LoadingState';
import Results from './components/Results';
import { useToast, ToastContainer } from './components/Toast';
import { analyseWithGemini } from './utils/gemini';

export default function App() {
  const [view, setView] = useState('upload');
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const { toasts, showToast } = useToast();

  // Handle file selection
  const handleFileSelect = useCallback((selectedFile) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type)) {
      showToast('Please upload an image (JPG, PNG, WebP) or PDF file.', 'error');
      return;
    }
    if (selectedFile.size > 20 * 1024 * 1024) {
      showToast('File too large. Maximum size is 20 MB.', 'error');
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFileBase64(e.target.result);
      if (selectedFile.type.startsWith('image/')) {
        setPreviewSrc(e.target.result);
      } else {
        setPreviewSrc(
          'data:image/svg+xml,' +
          encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="12" y="4" width="40" height="56" rx="4" fill="%231a1a24" stroke="%236366f1" stroke-width="2"/><text x="32" y="38" text-anchor="middle" fill="%236366f1" font-family="Inter,sans-serif" font-size="12" font-weight="700">PDF</text></svg>`
          )
        );
      }
    };
    reader.readAsDataURL(selectedFile);
  }, [showToast]);

  // Remove file
  const handleRemove = useCallback(() => {
    setFile(null);
    setPreviewSrc('');
    setFileBase64('');
  }, []);

  // Analyse
  const handleAnalyse = useCallback(async () => {
    if (!file || !fileBase64) return;

    setIsAnalysing(true);
    setView('loading');

    try {
      const data = await analyseWithGemini(fileBase64, file.type);
      setResult(data);
      setView('results');
      showToast('Bill analysed successfully!', 'success');
    } catch (err) {
      console.error('Analysis error:', err);
      setView('upload');
      showToast(`Analysis failed: ${err.message}`, 'error', 5000);
    } finally {
      setIsAnalysing(false);
    }
  }, [file, fileBase64, showToast]);

  // New scan
  const handleNewScan = useCallback(() => {
    setView('upload');
    setFile(null);
    setPreviewSrc('');
    setFileBase64('');
    setResult(null);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
        {/* Glows */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.15)_0%,transparent_70%)] blur-[120px] opacity-40 animate-glow-float" />
        <div className="absolute top-1/2 -right-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(168,85,247,0.12)_0%,transparent_70%)] blur-[120px] opacity-40 animate-glow-float" style={{ animationDelay: '-7s' }} />
        <div className="absolute -bottom-12 left-1/3 w-[350px] h-[350px] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_70%)] blur-[120px] opacity-40 animate-glow-float" style={{ animationDelay: '-14s' }} />
      </div>

      {/* Header */}
      <Header />

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-16">
        {/* Upload View */}
        {view === 'upload' && (
          <section>
            <div className="mb-5">
              <h2 className="text-2xl font-bold tracking-tight mb-1">Upload GST Bill</h2>
              <p className="text-sm text-gray-400">Drop your invoice image or PDF to extract product & tax information instantly</p>
            </div>

            {!file && <DropZone onFileSelect={handleFileSelect} />}

            {file && (
              <Preview
                file={file}
                previewSrc={previewSrc}
                onRemove={handleRemove}
                onAnalyse={handleAnalyse}
                isAnalysing={isAnalysing}
              />
            )}
          </section>
        )}

        {/* Loading View */}
        {view === 'loading' && <LoadingState />}

        {/* Results View */}
        {view === 'results' && (
          <Results result={result} onNewScan={handleNewScan} />
        )}
      </main>

      {/* Toasts */}
      <ToastContainer toasts={toasts} />
    </div>
  );
}
