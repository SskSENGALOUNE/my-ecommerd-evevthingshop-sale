import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class IquriExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost): void;
}
