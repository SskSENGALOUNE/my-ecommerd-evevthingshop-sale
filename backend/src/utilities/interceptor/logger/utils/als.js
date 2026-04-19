"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServiceName = exports.getTraceId = exports.als = void 0;
const async_hooks_1 = require("async_hooks");
exports.als = new async_hooks_1.AsyncLocalStorage();
const getTraceId = () => {
    const store = exports.als.getStore();
    return store === null || store === void 0 ? void 0 : store.get('traceId');
};
exports.getTraceId = getTraceId;
const getServiceName = () => {
    const store = exports.als.getStore();
    return store === null || store === void 0 ? void 0 : store.get('serviceName');
};
exports.getServiceName = getServiceName;
//# sourceMappingURL=als.js.map