/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { firstValueFrom, catchError, timeout } from 'rxjs';

export interface RequestOptions extends AxiosRequestConfig {
  timeoutMs?: number;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, any>;
}

@Injectable()
export class ApiHelper {
  private readonly logger = new Logger(ApiHelper.name);

  constructor(private readonly httpService: HttpService) {}

  async get<T = any>(url: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(() => this.httpService.get<T>(url, this.axiosConfig(options)), options, 'GET', url);
  }

  async post<T = any>(url: string, body?: any, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(() => this.httpService.post<T>(url, body, this.axiosConfig(options)), options, 'POST', url);
  }

  async put<T = any>(url: string, body?: any, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(() => this.httpService.put<T>(url, body, this.axiosConfig(options)), options, 'PUT', url);
  }

  async patch<T = any>(url: string, body?: any, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(() => this.httpService.patch<T>(url, body, this.axiosConfig(options)), options, 'PATCH', url);
  }

  async delete<T = any>(url: string, options: RequestOptions = {}): Promise<HttpResponse<T>> {
    return this.request<T>(() => this.httpService.delete<T>(url, this.axiosConfig(options)), options, 'DELETE', url);
  }

  // ─── Private helpers ──────────────────────────────────────────────────────────

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private axiosConfig({ timeoutMs: _timeoutMs, ...rest }: RequestOptions): AxiosRequestConfig {
    return rest;
  }

  private async request<T>(
    factory: () => ReturnType<HttpService['get']>,
    options: RequestOptions,
    method: string,
    url: string,
  ): Promise<HttpResponse<T>> {
    const { timeoutMs = 10_000 } = options;
    const response = await firstValueFrom(
      factory().pipe(
        timeout(timeoutMs),
        catchError((err) => this.handleError(err, method, url)),
      ),
    );
    return this.toHttpResponse<T>(response as AxiosResponse<T>);
  }

  private toHttpResponse<T>(response: AxiosResponse<T>): HttpResponse<T> {
    return {
      data: response.data,
      status: response.status,
      headers: response.headers as Record<string, any>,
    };
  }

  private handleError(err: any, method: string, url: string): never {
    const status = err?.response?.status;
    const message = err?.response?.data?.message ?? err?.message ?? 'Unknown error';
    this.logger.error(`[${method}] ${url} → ${status ?? 'TIMEOUT/NETWORK'}: ${message}`);
    const error = new Error(message) as any;
    error.status = status;
    error.response = err?.response?.data;
    throw error;
  }
}
