import { BaseApiService } from './BaseApiService'

export interface ApiLaureate {
  id: string
  knownName?: { en: string }
  orgName?: { en: string }
  birth?: {
    date?: string
    place?: {
      country?: { en: string }
    }
  }
  founded?: {
    date?: string
    place?: {
      country?: { en: string }
    }
  }
  nobelPrizes?: Array<{
    awardYear: string
    category: { en: string }
  }>
}

export interface LaureatesApiResponse {
  laureates: ApiLaureate[]
  meta: {
    offset: number
    limit: number
    count: number
  }
}

export interface FormattedLaureate {
  id: string
  name: string
  birthOrFounding: string
  country: string
  prizesCount: number
  prizesSummary: string
}

export interface LaureatesQueryParams {
  offset?: number
  limit?: number
  name?: string
}

export class LaureatesService extends BaseApiService {
  /**
   * Получение списка лауреатов с поддержкой пагинации и поиска по имени
   */
  async getLaureates(params: LaureatesQueryParams = {}): Promise<{ items: FormattedLaureate[]; total: number }> {
    const cleanParams: Record<string, any> = {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10
    }

    if (params.name && params.name.trim()) {
      cleanParams.name = params.name.trim()
    }

    const data = await this.get<LaureatesApiResponse>('/laureates', cleanParams)

    const items: FormattedLaureate[] = (data.laureates || []).map((l) => {
      const name = l.knownName?.en || l.orgName?.en || `Лауреат #${l.id}`
      const date = l.birth?.date || l.founded?.date || '—'
      const country = l.birth?.place?.country?.en || l.founded?.place?.country?.en || '—'
      const prizes = l.nobelPrizes || []
      const prizesSummary = prizes
        .map((p) => `${p.category.en} (${p.awardYear})`)
        .join(', ')

      return {
        id: l.id,
        name,
        birthOrFounding: date,
        country,
        prizesCount: prizes.length,
        prizesSummary: prizesSummary || '—'
      }
    })

    return {
      items,
      total: data.meta?.count ?? items.length
    }
  }
}

export const laureatesService = new LaureatesService()

