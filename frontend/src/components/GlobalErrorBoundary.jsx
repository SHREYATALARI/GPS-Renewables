import { Component } from 'react';

export default class GlobalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[GlobalErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FBF8] flex items-center justify-center p-6">
          <div className="max-w-xl w-full rounded-2xl border border-emerald-100 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-800">Scientific module recovered safely</h2>
            <p className="text-sm text-slate-600 mt-2">
              A runtime issue was detected and contained. Use navigation to continue in another module.
            </p>
            <button
              onClick={() => window.location.assign('/dashboard')}
              className="mt-4 text-sm px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700"
            >
              Return to dashboard
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
