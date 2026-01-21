import React, { Component, ErrorInfo, ReactNode } from 'react';
import { errorHandler } from '@/services/errorHandler';
import { CrashScreen } from './CrashScreen';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to error handler
    errorHandler.handleError(error, false, `ErrorBoundary: ${errorInfo.componentStack || 'Unknown component'}`);
    
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  handleDismiss = () => {
    // For now, same as reset
    this.handleReset();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <CrashScreen
          error={this.state.error || new Error('Unknown error')}
          onRetry={this.handleReset}
          onDismiss={this.handleDismiss}
          showDetails={__DEV__}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
