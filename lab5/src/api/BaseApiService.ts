import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import * as t from 'io-ts'
import { decodeOrThrow } from '../utils/decode'

/**
 * Базовый класс-сервис с поддержкой Service Worker кеширования и локального офлайн-фоллбэка
 */
export class BaseApiService {
  protected http: AxiosInstance
  private cachePrefix = 'nobel_api_cache_'

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
        const errorMessage = error.response?.data?.message || error.message || 'Ошибка сети'
        console.warn(`[BaseApiService]: ${errorMessage}`)
        return Promise.reject(error)
      }
    )
  }

  /**
   * Выполняет GET-запрос:
   * 1. В штатном режиме Service Worker перехватывает запрос по стратегии NetworkFirst.
   * 2. В случае полного отключения сети или сбоя извлекаются кешированные данные.
   * 3. Ответ валидируется и декодируется через io-ts decodeOrThrow.
   */
  protected async getValidated<A, O, I>(
    url: string,
    codec: t.Type<A, O, I>,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<{ data: A; fromCache: boolean }> {
    const cacheKey = `${this.cachePrefix}${url}_${JSON.stringify(params || {})}`

    try {
      const response = await this.http.get(url, {
        ...config,
        params
      })

      // Сохраняем успешный ответ в локальное резервное хранилище (к Service Worker кешу)
      try {
        localStorage.setItem(cacheKey, JSON.stringify(response.data))
      } catch (e) {
        // Игнорируем переполнение квоты storage
      }

      const decoded = decodeOrThrow(codec, response.data)
      return { data: decoded, fromCache: false }
    } catch (networkError) {
      // При отсутствии сети пытаемся прочитать из кеша
      console.info(`[BaseApiService]: Сеть недоступна, проверяем наличие данных в офлайн-кеше для ${cacheKey}`)
      const cachedString = localStorage.getItem(cacheKey)

      if (cachedString) {
        try {
          const cachedJson = JSON.parse(cachedString)
          const decoded = decodeOrThrow(codec, cachedJson)
          return { data: decoded, fromCache: true }
        } catch (parseOrDecodeErr) {
          console.error('[BaseApiService]: Ошибка декодирования закешированных данных', parseOrDecodeErr)
        }
      }

      throw new Error('Отсутствует интернет-соединение, и данные для данного запроса еще не были закешированы.')
    }
  }
}

