/**
 * Базовый HTTP клиент
 * Обертка над fetch с обработкой ошибок
 */

interface RequestConfig extends RequestInit {
  baseURL?: string;
  token?: string;
}

export class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string, token?: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    };
  }

  async request<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const url = `${config?.baseURL || this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...config,
      headers: {
        ...this.defaultHeaders,
        ...config?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'GET',
    });
  }
}
