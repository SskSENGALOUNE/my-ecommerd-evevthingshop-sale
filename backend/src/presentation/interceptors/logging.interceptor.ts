// shared/interceptors/logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger('HTTP');

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, ip } = request;
        const startTime = Date.now();

        return next.handle().pipe(
            tap({
                next: () => {
                    const response = context.switchToHttp().getResponse();
                    const duration = Date.now() - startTime;
                    this.logger.log(
                        `[${method}] ${url} ${response.statusCode} - ${duration}ms - ${ip}`,
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;
                    const status = error?.getStatus?.() || 500;
                    this.logger.error(
                        `[${method}] ${url} ${status} - ${duration}ms - ${ip} - ${error.message}`,
                    );
                },
            }),
        );
    }
}