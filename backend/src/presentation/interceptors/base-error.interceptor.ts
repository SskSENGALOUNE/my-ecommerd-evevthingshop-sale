import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { BaseResponse } from '../common/responses/base.response';

@Injectable()
export class BaseErrorInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof HttpException) {
          return throwError(() =>
            new HttpException(
              BaseResponse.error(
                err.name,
                err.message,
              ),
              err.getStatus(),
            ),
          );
        }

        return throwError(() =>
          new HttpException(
            BaseResponse.error(
              'INTERNAL_ERROR',
              'Unexpected error',
            ),
            500,
          ),
        );
      }),
    );
  }
}
