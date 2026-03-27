/**
 * Production-safe logger utility
 * Only logs in development mode (__DEV__)
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogCategory =
    | 'OrderStatus'
    | 'Notification'
    | 'Cart'
    | 'Order'
    | 'Orders'
    | 'Maps'
    | 'Location'
    | 'Network'
    | 'GraphQL'
    | 'General';

interface LoggerOptions {
    category?: LogCategory;
    level?: LogLevel;
}

class Logger {
    private formatMessage(category: LogCategory | undefined, message: string, ...args: unknown[]): string {
        const prefix = category ? `[${category}]` : '';
        return `${prefix} ${message}`;
    }

    private log(level: LogLevel, category: LogCategory | undefined, message: string, ...args: unknown[]): void {
        if (!__DEV__) return;

        const formattedMessage = this.formatMessage(category, message);

        switch (level) {
            case 'debug':
                console.log(formattedMessage, ...args);
                break;
            case 'info':
                console.info(formattedMessage, ...args);
                break;
            case 'warn':
                console.warn(formattedMessage, ...args);
                break;
            case 'error':
                console.error(formattedMessage, ...args);
                break;
        }
    }

    debug(message: string, ...args: unknown[]): void;
    debug(category: LogCategory, message: string, ...args: unknown[]): void;
    debug(categoryOrMessage: LogCategory | string, messageOrArg?: string | unknown, ...args: unknown[]): void {
        if (typeof categoryOrMessage === 'string' && messageOrArg === undefined) {
            this.log('debug', undefined, categoryOrMessage);
        } else if (typeof messageOrArg === 'string') {
            this.log('debug', categoryOrMessage as LogCategory, messageOrArg, ...args);
        } else {
            this.log('debug', categoryOrMessage as LogCategory, '', messageOrArg, ...args);
        }
    }

    info(message: string, ...args: unknown[]): void;
    info(category: LogCategory, message: string, ...args: unknown[]): void;
    info(categoryOrMessage: LogCategory | string, messageOrArg?: string | unknown, ...args: unknown[]): void {
        if (typeof categoryOrMessage === 'string' && messageOrArg === undefined) {
            this.log('info', undefined, categoryOrMessage);
        } else if (typeof messageOrArg === 'string') {
            this.log('info', categoryOrMessage as LogCategory, messageOrArg, ...args);
        } else {
            this.log('info', categoryOrMessage as LogCategory, '', messageOrArg, ...args);
        }
    }

    warn(message: string, ...args: unknown[]): void;
    warn(category: LogCategory, message: string, ...args: unknown[]): void;
    warn(categoryOrMessage: LogCategory | string, messageOrArg?: string | unknown, ...args: unknown[]): void {
        if (typeof categoryOrMessage === 'string' && messageOrArg === undefined) {
            this.log('warn', undefined, categoryOrMessage);
        } else if (typeof messageOrArg === 'string') {
            this.log('warn', categoryOrMessage as LogCategory, messageOrArg, ...args);
        } else {
            this.log('warn', categoryOrMessage as LogCategory, '', messageOrArg, ...args);
        }
    }

    error(message: string, ...args: unknown[]): void;
    error(category: LogCategory, message: string, ...args: unknown[]): void;
    error(categoryOrMessage: LogCategory | string, messageOrArg?: string | unknown, ...args: unknown[]): void {
        if (typeof categoryOrMessage === 'string' && messageOrArg === undefined) {
            this.log('error', undefined, categoryOrMessage);
        } else if (typeof messageOrArg === 'string') {
            this.log('error', categoryOrMessage as LogCategory, messageOrArg, ...args);
        } else {
            this.log('error', categoryOrMessage as LogCategory, '', messageOrArg, ...args);
        }
    }
}

export const logger = new Logger();
