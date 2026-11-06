import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Единый базовый класс-сервис для выполнения HTTP-запросов через Axios
 */
export class BaseApiService {
  protected http: AxiosInstance

  constructor(baseURL: string = 'https://api.nobelprize.org/v2.1') {
    this.http = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    this.setupInterceptors()
  }

  /**
   * Настройка перехватчиков (interceptors) запросов и ответов
   */
  private setupInterceptors(): void {
    // Перехватчик запросов
    this.http.interceptors.request.use(
      (config) => {
        // Здесь можно логировать запросы или передавать токены
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Перехватчик ответов
    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error) => {
        // Централизованная обработка ошибок сети
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка сетевого запроса'
        console.error(`[BaseApiService Error]: ${errorMessage}`, error)
        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  /**
   * Универсальный метод выполнения GET-запроса
   */
  protected async get<T>(url: string, params?: Record<string, any>, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.http.get<T>(url, {
      ...config,
      params
    })
    return response.data
  }
}

