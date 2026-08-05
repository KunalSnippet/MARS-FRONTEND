import React from 'react';

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-shell">
          <div className="card error-card">
            <div className="eyebrow">UI error</div>
            <h2>Something interrupted the page.</h2>
            <p className="muted">{this.state.message}</p>
            <p className="muted">Reload the page after fixing the backend or frontend config that caused the crash.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}