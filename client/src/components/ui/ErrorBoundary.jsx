import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
import { Sentry } from '../../lib/sentry.js';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback(this.state.error, this.handleReset);

      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-500/10 text-danger-700">
            <AlertTriangle size={28} aria-hidden="true" />
          </div>
          <h2 className="font-heading text-h3 text-neutral-900">Something went wrong</h2>
          <p className="max-w-md text-neutral-600">
            This section couldn&apos;t load. Please try again, or head back to the homepage.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={this.handleReset}>
              Try again
            </Button>
            <Button to="/">Back to Home</Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
