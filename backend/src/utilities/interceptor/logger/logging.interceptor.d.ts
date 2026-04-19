import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoggerOptions } from './interfaces';
export declare class LoggingInterceptor implements NestInterceptor {
    private options;
    constructor(options?: LoggerOptions);
    intercept(context: ExecutionContext, next: CallHandler): Observable<unknown>;
}
