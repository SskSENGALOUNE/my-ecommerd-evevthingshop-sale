import { AsyncLocalStorage } from 'async_hooks';
import { RequestContext } from '../interfaces';
export declare const als: AsyncLocalStorage<Map<keyof RequestContext, string>>;
export declare const getTraceId: () => string | undefined;
export declare const getServiceName: () => string | undefined;
