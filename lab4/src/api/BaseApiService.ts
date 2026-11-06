import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as t from 'io-ts'
import { decodeOrThrow } from '../utils/decode'

/**
 * Базовый класс-сервис для работы с API с встроенной io-ts валидацией
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

  private setupInterceptors(): void {
    this.http.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка сетевого запроса'
        console.error(`[BaseApiService Error]: ${errorMessage}`, error)
        return Promise.reject(new Error(errorMessage))
      }
    )
  }

  /**
   * Выполняет GET-запрос и декодирует ответ через io-ts кодек с помощью decodeOrThrow
   */
  protected async getValidated<A, O, I>(
    url: string,
    codec: t.Type<A, O, I>,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<A> {
    const response = await this.http.get(url, {
      ...config,
      params
    })

    // Строгая проверка типов через io-ts и fp-ts Either
    return decodeOrThrow(codec, response.data)
  }
}

