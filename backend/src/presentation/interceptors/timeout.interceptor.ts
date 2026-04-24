// shared/interceptors/timeout.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    RequestTimeoutException,
} from '@nestjs/common';
import { Observable, throwError, timeout, catchError, TimeoutError } from 'rxjs';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    private readonly timeoutMs: number;

    constructor(timeoutMs = 30000) {
        this.timeoutMs = timeoutMs;
    }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(this.timeoutMs),
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(
                        () => new RequestTimeoutException('Request timed out'),
                    );
                }
                return throwError(() => err);
            }),
        );
    }
}