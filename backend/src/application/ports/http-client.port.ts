// application/ports/http-client.port.ts
export interface HttpClient {
  get<T>(url: string, config?: unknown): Promise<T>;
  post<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  put<T>(url: string, data?: unknown, config?: unknown): Promise<T>;
  delete<T>(url: string, config?: unknown): Promise<T>;
}
