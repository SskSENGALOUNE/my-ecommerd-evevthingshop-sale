import * as winston from 'winston';
interface OriginalConsoleMethods {
    log: typeof console.log;
    info: typeof console.info;
    warn: typeof console.warn;
    error: typeof console.error;
    debug: typeof console.debug;
}
export declare const iquriLogger: winston.Logger;
export declare function enableConsoleHijacking(): void;
export declare function disableConsoleHijacking(): void;
export declare function isConsoleHijacked(): boolean;
export declare function getOriginalConsole(): OriginalConsoleMethods | null;
export {};
