'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-8 h-8 mb-4 flex items-center justify-center border-2 border-forest/30 rounded-full">
              <span className="text-forest/50 font-data text-sm font-bold">!</span>
            </div>
            <p className="font-data text-xs tracking-[0.1em] sm:tracking-[0.2em] text-forest/50 uppercase mb-2">
              Component Error
            </p>
            <p className="font-body text-sm text-slate text-center">
              Something went wrong loading this section.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 font-data text-xs tracking-[0.1em] sm:tracking-[0.2em] uppercase px-5 py-2 border border-forest/30 text-forest/70 hover:bg-forest/5 transition-colors"
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
