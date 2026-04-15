import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import DropZone from './components/DropZone';
import Preview from './components/Preview';
import LoadingState from './components/LoadingState';
import Results from './components/Results';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import { useToast, ToastContainer } from './components/Toast';
import { apiGetMe, logout as apiLogout, getStoredToken, apiAnalyzeBill } from './utils/api';

export default function App() {
  // Auth state
  const [user, setUser] = useState(null);
  const [authPage, setAuthPage] = useState('login'); // 'login' | 'signup' | 'forgot'
  const [authLoading, setAuthLoading] = useState(true); // Check stored token on mount

  // App state
  const [view, setView] = useState('upload');
  const [file, setFile] = useState(null);
  const [previewSrc, setPreviewSrc] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [result, setResult] = useState(null);
  const [isAnalysing, setIsAnalysing] = useState(false);
  const { toasts, showToast } = useToast();

  // ─── Auto-login from stored token (Remember Me) ───
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setAuthLoading(false);
      return;
    }

    apiGetMe()
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => {
        // Token expired or invalid — clear it
        apiLogout();
      })
      .finally(() => {
        setAuthLoading(false);
      });
  }, []);

  // Auth handlers
  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setAuthPage('login');
    showToast(`Welcome back, ${userData.name}!`, 'success');
  }, [showToast]);

  const handleSignup = useCallback((userData) => {
    setUser(userData);
    showToast(`Welcome, ${userData.name}! Account created successfully.`, 'success');
  }, [showToast]);

  const handleResetSuccess = useCallback((userData) => {
    setUser(userData);
    showToast('Password reset successful. Welcome back!', 'success');
  }, [showToast]);

  const handleLogout = useCallback(() => {
    apiLogout();
    setUser(null);
    setView('upload');
    setFile(null);
    setPreviewSrc('');
    setFileBase64('');
    setResult(null);
    showToast('Logged out successfully.', 'info');
  }, [showToast]);

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
            `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none"><rect x="12" y="4" width="40" height="56" rx="4" fill="%23eef9f5" stroke="%2300a878" stroke-width="2"/><text x="32" y="38" text-anchor="middle" fill="%2300a878" font-family="Inter,sans-serif" font-size="12" font-weight="700">PDF</text></svg>`
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

  // Analyse Success handler
  const handleAnalyseResult = useCallback((data) => {
    setResult(data);
    setView('results');
    showToast('Bill analysed successfully!', 'success');
  }, [showToast]);

  // New scan
  const handleNewScan = useCallback(() => {
    setView('upload');
    setFile(null);
    setPreviewSrc('');
    setFileBase64('');
    setResult(null);
  }, []);

  // ─── Loading State (checking stored auth) ───
  if (authLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-accent z-20" />
        <div className="text-center animate-fade-in-up">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-[4px] border-accent/20 border-t-accent animate-spin-loader" />
          <p className="text-sm font-bold text-text-secondary uppercase tracking-widest">Loading...</p>
        </div>
      </div>
    );
  }

  // ─── Auth Pages ───
  if (!user) {
    return (
      <>
        {authPage === 'login' && (
          <LoginPage
            onLogin={handleLogin}
            onSwitchToSignup={() => setAuthPage('signup')}
            onForgotPassword={() => setAuthPage('forgot')}
          />
        )}
        {authPage === 'signup' && (
          <SignupPage
            onSignup={handleSignup}
            onSwitchToLogin={() => setAuthPage('login')}
          />
        )}
        {authPage === 'forgot' && (
          <ForgotPasswordPage
            onResetSuccess={handleResetSuccess}
            onBackToLogin={() => setAuthPage('login')}
          />
        )}
        <ToastContainer toasts={toasts} />
      </>
    );
  }

  // ─── Main App ───
  return (
    <div className="min-h-screen bg-bg-primary relative overflow-x-hidden">
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-accent z-[60]" />
      
      {/* Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full bg-accent/5 blur-[120px] opacity-60 animate-glow-float" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] rounded-full bg-accent/3 blur-[120px] opacity-40 animate-glow-float" style={{ animationDelay: '-7s' }} />
        <div className="absolute -bottom-12 left-1/3 w-[450px] h-[450px] rounded-full bg-accent/5 blur-[120px] opacity-50 animate-glow-float" style={{ animationDelay: '-14s' }} />
      </div>

      {/* Header */}
      <Header user={user} onLogout={handleLogout} />

      {/* Main */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 pb-16">
        {/* Upload View */}
        {view === 'upload' && (
          <section className="animate-fade-in-up">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-2">Upload GST Bill</h2>
              <p className="text-base text-text-secondary">Drop your invoice image or PDF to extract product & tax information instantly</p>
            </div>

            {!file && <DropZone onFileSelect={handleFileSelect} />}

            {file && (
              <Preview
                file={file}
                previewSrc={previewSrc}
                onRemove={handleRemove}
                onResult={handleAnalyseResult}
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
