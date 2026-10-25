import { Component, type ReactNode } from 'react';

/** Keeps a crash in one screen from blanking the whole app; progress stays saved. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="card mx-auto mt-10 max-w-md p-8 text-center">
        <h2 className="mb-2 text-3xl">Oeps!</h2>
        <p className="mb-4 text-muted">Something went wrong on this screen. Your progress is saved.</p>
        <pre className="mb-4 overflow-x-auto rounded-xl bg-glaze p-3 text-left text-xs text-muted">{this.state.error.message}</pre>
        <button
          className="btn-primary"
          onClick={() => {
            this.setState({ error: null });
            window.location.assign('/');
          }}
        >
          Back to today
        </button>
      </div>
    );
  }
}
