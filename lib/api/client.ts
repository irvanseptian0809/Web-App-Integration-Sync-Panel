import { ApiError } from './errors';

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean>;
};

export async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, headers, ...customOptions } = options;

  const url = new URL(endpoint, process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const response = await fetch(url.toString(), {
    headers: { ...defaultHeaders, ...headers },
    ...customOptions,
  });

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }
    throw new ApiError(response.status, errorData.message || 'An error occurred', errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body?: any, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string, options?: FetchOptions) =>
    fetcher<T>(endpoint, { ...options, method: 'DELETE' }),
};
