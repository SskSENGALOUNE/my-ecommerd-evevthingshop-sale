export interface LoggerOptions {
    serviceName?: string;
    enableAccessLog?: boolean;
    enableConsoleHijacking?: boolean;
    skipPaths?: string[];
    logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
export interface TracedRequest {
    traceId?: string;
    serviceName?: string;
    method: string;
    originalUrl: string;
    url: string;
    ip?: string;
    socket?: {
        remoteAddress?: string;
    };
    headers: Record<string, string | string[] | undefined> & {
        'x-trace-id'?: string;
        'user-agent'?: string;
    };
}
export interface RequestContext {
    traceId: string;
    serviceName: string;
}
export interface SerializedError {
    name: string;
    message: string;
    stack?: string;
}
export interface LogObject {
    message?: string;
    traceId?: string;
    serviceName?: string;
    error?: SerializedError;
    args?: unknown[];
    [key: string]: unknown;
}
export interface HttpExceptionResponse {
    message?: string;
    error?: string;
    statusCode?: number;
}
