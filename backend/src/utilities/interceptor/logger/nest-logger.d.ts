import { LoggerService } from '@nestjs/common';
export declare class IquriNestLogger implements LoggerService {
    private context?;
    constructor(context?: string);
    private formatMessage;
    log(message: unknown, context?: string): void;
    error(message: unknown, trace?: string, context?: string): void;
    warn(message: unknown, context?: string): void;
    debug(message: unknown, context?: string): void;
    verbose(message: unknown, context?: string): void;
    setContext(context: string): void;
}
export declare const nestLogger: IquriNestLogger;
