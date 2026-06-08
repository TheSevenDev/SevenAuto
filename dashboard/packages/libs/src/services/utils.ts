import { AxiosError, AxiosResponse } from 'axios';

export { prepareQueryParams } from '../utils/prepare-query-params';
export { removeNullObject } from '../utils/remove-null-object';

const extractMessageFromBody = (body: unknown): string | undefined => {
  if (!body) return undefined;

  if (typeof body === 'string') return body;

  if (Array.isArray(body)) {
    const first = body[0] as {
      constraints?: Record<string, string>;
      message?: string | string[];
    };
    if (first?.constraints) {
      return Object.values(first.constraints)[0];
    }
    if (Array.isArray(first?.message)) {
      return first.message[0];
    }
    if (typeof first?.message === 'string') {
      return first.message;
    }
    return undefined;
  }

  if (typeof body === 'object') {
    const record = body as Record<string, unknown>;
    if (typeof record.message === 'string') return record.message;
    if (Array.isArray(record.message)) {
      const first = record.message[0];
      if (typeof first === 'string') return first;
      if (first && typeof first === 'object' && 'constraints' in first) {
        const constraints = (first as { constraints?: Record<string, string> })
          .constraints;
        if (constraints) return Object.values(constraints)[0];
      }
    }
    if (typeof record.error === 'string') return record.error;
    if (Array.isArray(record.errors)) {
      const first = record.errors[0] as { message?: string };
      if (first?.message) return first.message;
    }
  }

  return undefined;
};

export const handleApiResponse = <T>(response: AxiosResponse): T | null => {
  try {
    if (!response) {
      throw new Error('No response received');
    }

    if (response.status >= 400) {
      const message =
        extractMessageFromBody(response.data) || 'API request failed';
      if (typeof window !== 'undefined') throw new Error(message);
      return null;
    }

    if (!response.data) {
      throw new Error('No response data');
    }

    const { data, status, statusCode, message, error } = response.data;
    const statusCheck = status || statusCode;
    if (
      statusCheck &&
      statusCheck !== 200 &&
      statusCheck !== 201 &&
      statusCheck !== 204
    ) {
      if (typeof window !== 'undefined') throw new Error(message || error);
      return null;
    }

    return data as T;
  } catch (error: unknown) {
    if (typeof window !== 'undefined' && error instanceof Error) {
      throw error;
    }
    return null;
  }
};

export const handleErrorResponse = (
  error: unknown,
  defaultMessage = 'basic.apiError',
) => {
  if (typeof error === 'string') return error || defaultMessage;

  if (error instanceof AxiosError) {
    const message = extractMessageFromBody(error.response?.data);
    if (message) return message;
    return defaultMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage || 'Unknown error';
};

export const requireApiResponse = <T>(response: AxiosResponse): T => {
  const data = handleApiResponse<T>(response);
  if (data === null || data === undefined) {
    throw new Error('API request failed');
  }
  return data;
};
