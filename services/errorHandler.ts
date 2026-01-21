import { ErrorUtils } from 'react-native';
import { config } from '@/config/env';

export interface ErrorInfo {
  error: Error;
  isFatal: boolean;
  timestamp: Date;
  context?: string;
}

class ErrorHandlerService {
  private errorQueue: ErrorInfo[] = [];
  private maxQueueSize = 50;

  /**
   * Initialize global error handlers
   */
  initialize() {
    // Global error handler for JavaScript errors
    // ErrorUtils might not be available in all React Native versions
    try {
      if (ErrorUtils && typeof ErrorUtils.getGlobalHandler === 'function') {
        const originalHandler = ErrorUtils.getGlobalHandler();
        
        if (typeof ErrorUtils.setGlobalHandler === 'function') {
          ErrorUtils.setGlobalHandler((error: Error, isFatal?: boolean) => {
            this.handleError(error, isFatal ?? false);
            
            // Call original handler in dev mode for debugging
            if (__DEV__ && originalHandler) {
              originalHandler(error, isFatal);
            }
          });
        }
      }
    } catch (e) {
      // ErrorUtils not available, that's okay - ErrorBoundary will catch errors
      if (__DEV__) {
        console.warn('[ErrorHandler] ErrorUtils not available, using ErrorBoundary only');
      }
    }

    // Check critical environment variables on startup
    this.validateEnvironment();
  }

  /**
   * Handle an error
   */
  handleError(error: Error, isFatal: boolean = false, context?: string) {
    const errorInfo: ErrorInfo = {
      error,
      isFatal,
      timestamp: new Date(),
      context,
    };

    // Add to queue
    this.errorQueue.push(errorInfo);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    // Log error
    this.logError(errorInfo);

    // If fatal, we might want to show a crash screen
    // But for now, ErrorBoundary will handle it
  }

  /**
   * Log error to console (and potentially to remote service)
   */
  private logError(errorInfo: ErrorInfo) {
    const { error, isFatal, timestamp, context } = errorInfo;
    
    const logMessage = [
      `[ErrorHandler] ${isFatal ? 'FATAL' : 'ERROR'}`,
      `Time: ${timestamp.toISOString()}`,
      context ? `Context: ${context}` : '',
      `Message: ${error.message}`,
      `Stack: ${error.stack || 'No stack trace'}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (__DEV__) {
      console.error(logMessage);
    }

    // TODO: In production, send to crash reporting service (e.g., Sentry, Bugsnag)
    // if (!__DEV__) {
    //   crashlytics().recordError(error);
    // }
  }

  /**
   * Validate critical environment variables
   */
  private validateEnvironment() {
    const missing: string[] = [];

    if (!config.supabaseUrl || config.supabaseUrl.trim() === '') {
      missing.push('EXPO_PUBLIC_SUPABASE_URL');
    }

    if (!config.supabaseAnonKey || config.supabaseAnonKey.trim() === '') {
      missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');
    }

    if (!config.supabaseGraphqlUrl || config.supabaseGraphqlUrl.trim() === '') {
      missing.push('EXPO_PUBLIC_SUPABASE_GRAPHQL_URL');
    }

    if (missing.length > 0) {
      const error = new Error(
        `Missing required environment variables: ${missing.join(', ')}. ` +
        'Please check your EAS Build configuration and Expo Dashboard secrets.'
      );
      
      this.handleError(error, true, 'Environment Validation');
      
      // In production, this will cause the app to show ErrorBoundary
      // In dev, we just warn
      if (__DEV__) {
        console.warn('[ErrorHandler] Environment validation failed:', missing);
      }
    }
  }

  /**
   * Get recent errors (for debugging)
   */
  getRecentErrors(limit: number = 10): ErrorInfo[] {
    return this.errorQueue.slice(-limit);
  }

  /**
   * Clear error queue
   */
  clearErrors() {
    this.errorQueue = [];
  }
}

// Singleton instance
export const errorHandler = new ErrorHandlerService();
