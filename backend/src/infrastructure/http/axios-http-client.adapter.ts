// infrastructure/http/axios-http-client.adapter.ts
import { Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpClient } from '../../application/ports/http-client.port';

export class AxiosHttpClientAdapter implements HttpClient {
  private readonly axios: AxiosInstance;
  private readonly maxRetry = 3;
  private readonly logger = new Logger(AxiosHttpClientAdapter.name);

  constructor(baseURL?: string) {
    this.axios = axios.create({
      baseURL,
      timeout: 10_000,
    });
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.axios.get(url, config));
  }

  async post<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.requestWithRetry<T>(() => this.axios.post(url, data, config));
  }

  async put<T>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    return this.requestWithRetry<T>(() => this.axios.put(url, data, config));
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.requestWithRetry<T>(() => this.axios.delete(url, config));
  }

  // -----------------------
  // Retry logic
  // -----------------------
  private async requestWithRetry<T>(
    requestFn: () => Promise<AxiosResponse<T>>,
    attempt = 1,
  ): Promise<T> {
    try {
      const response = await requestFn();
      return response.data;
    } catch (error: any) {
      const status = error?.response?.status;
      const isNetworkOr5xx = !status || (status >= 500 && status < 600);

      if (!isNetworkOr5xx || attempt >= this.maxRetry) {
        this.logger.error(
          `Request failed (attempt ${attempt}): ${error.message}`,
        );
        throw error;
      }

      const delayMs = 500 * 2 ** (attempt - 1); // exponential backoff
      this.logger.warn(
        `Retrying request (attempt ${attempt}) in ${delayMs}ms...`,
      );

      await this.delay(delayMs);
      return this.requestWithRetry(requestFn, attempt + 1);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
