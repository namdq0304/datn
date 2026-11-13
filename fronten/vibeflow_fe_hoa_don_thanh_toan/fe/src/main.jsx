import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error('[VibeFlow ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 font-sans selection:bg-violet-500 selection:text-white">
          <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-indigo-500 to-purple-600"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-2xl text-rose-400 shrink-0">
                ⚠️
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Đã có lỗi xảy ra (System Error)</h2>
                <p className="text-sm text-slate-400">Ứng dụng đã bắt được ngoại lệ hiển thị (Render Crash Protection).</p>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 my-4 font-mono text-xs overflow-x-auto text-rose-300 max-h-56">
              <p className="font-bold text-rose-400 mb-1">{this.state.error?.message || 'Lỗi không xác định'}</p>
              <pre className="text-slate-400 whitespace-pre-wrap">{this.state.error?.stack}</pre>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => this.setState({ error: null })}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-95 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-600/25 cursor-pointer"
              >
                Thử lại ngay
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-semibold text-sm transition-all cursor-pointer"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>

      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
