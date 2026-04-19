"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const als_1 = require("./als");
describe('AsyncLocalStorage Utils', () => {
    afterEach(() => {
        const store = als_1.als.getStore();
        if (store) {
            store.clear();
        }
    });
    describe('als', () => {
        it('should be defined', () => {
            expect(als_1.als).toBeDefined();
        });
        it('should run with a store', () => {
            const store = new Map();
            store.set('traceId', 'test-trace-id');
            als_1.als.run(store, () => {
                const currentStore = als_1.als.getStore();
                expect(currentStore).toBe(store);
                expect(currentStore === null || currentStore === void 0 ? void 0 : currentStore.get('traceId')).toBe('test-trace-id');
            });
        });
    });
    describe('getTraceId', () => {
        it('should return undefined when no store is active', () => {
            expect((0, als_1.getTraceId)()).toBeUndefined();
        });
        it('should return traceId from active store', () => {
            const store = new Map();
            store.set('traceId', 'test-trace-123');
            als_1.als.run(store, () => {
                expect((0, als_1.getTraceId)()).toBe('test-trace-123');
            });
        });
        it('should return undefined if traceId not set in store', () => {
            const store = new Map();
            store.set('serviceName', 'test-service');
            als_1.als.run(store, () => {
                expect((0, als_1.getTraceId)()).toBeUndefined();
            });
        });
    });
    describe('getServiceName', () => {
        it('should return undefined when no store is active', () => {
            expect((0, als_1.getServiceName)()).toBeUndefined();
        });
        it('should return serviceName from active store', () => {
            const store = new Map();
            store.set('serviceName', 'my-service');
            als_1.als.run(store, () => {
                expect((0, als_1.getServiceName)()).toBe('my-service');
            });
        });
        it('should return undefined if serviceName not set in store', () => {
            const store = new Map();
            store.set('traceId', 'test-trace-id');
            als_1.als.run(store, () => {
                expect((0, als_1.getServiceName)()).toBeUndefined();
            });
        });
    });
    describe('Nested contexts', () => {
        it('should handle nested store contexts', () => {
            const outerStore = new Map();
            outerStore.set('traceId', 'outer-trace');
            outerStore.set('serviceName', 'outer-service');
            const innerStore = new Map();
            innerStore.set('traceId', 'inner-trace');
            innerStore.set('serviceName', 'inner-service');
            als_1.als.run(outerStore, () => {
                expect((0, als_1.getTraceId)()).toBe('outer-trace');
                expect((0, als_1.getServiceName)()).toBe('outer-service');
                als_1.als.run(innerStore, () => {
                    expect((0, als_1.getTraceId)()).toBe('inner-trace');
                    expect((0, als_1.getServiceName)()).toBe('inner-service');
                });
                expect((0, als_1.getTraceId)()).toBe('outer-trace');
                expect((0, als_1.getServiceName)()).toBe('outer-service');
            });
        });
    });
});
//# sourceMappingURL=als.spec.js.map