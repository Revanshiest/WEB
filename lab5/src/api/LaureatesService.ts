import { BaseApiService } from './BaseApiService'
import { LaureatesApiResponseCodec, LaureatesApiResponse } from '../types/codecs'

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
  async getLaureates(params: LaureatesQueryParams = {}): Promise<{ items: FormattedLaureate[]; total: number; isCached: boolean }> {
    const cleanParams: Record<string, any> = {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10
    }

    if (params.name && params.name.trim()) {
      cleanParams.name = params.name.trim()
    }

    const { data, fromCache } = await this.getValidated('/laureates', LaureatesApiResponseCodec, cleanParams)

    const items: FormattedLaureate[] = data.laureates.map((l) => {
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
      total: data.meta.count,
      isCached: fromCache
    }
  }
}

export const laureatesService = new LaureatesService()

