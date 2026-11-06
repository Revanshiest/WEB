import { BaseApiService } from './BaseApiService'
import { PrizesApiResponseCodec, PrizesApiResponse } from '../types/codecs'

export interface FormattedPrize {
  id: string
  category: string
  awardYear: string
  prizeAmount: number
  dateAwarded: string
  laureatesList: string
  laureatesCount: number
}

export interface PrizesQueryParams {
  offset?: number
  limit?: number
  nobelPrizeYear?: number
  nobelPrizeCategory?: string
}

export class PrizesService extends BaseApiService {
  /**
   * Получение списка премий с автоматическим io-ts декодированием
   */
  async getPrizes(params: PrizesQueryParams = {}): Promise<{ items: FormattedPrize[]; total: number }> {
    const cleanParams: Record<string, any> = {
      offset: params.offset ?? 0,
      limit: params.limit ?? 10
    }

    if (params.nobelPrizeYear) {
      cleanParams.nobelPrizeYear = params.nobelPrizeYear
    }
    if (params.nobelPrizeCategory) {
      cleanParams.nobelPrizeCategory = params.nobelPrizeCategory
    }

    // Запрос + строгая валидация через кодек PrizesApiResponseCodec
    const data: PrizesApiResponse = await this.getValidated('/nobelPrizes', PrizesApiResponseCodec, cleanParams)

    const items: FormattedPrize[] = data.nobelPrizes.map((prize, idx) => {
      const laureates = prize.laureates || []
      const names = laureates
        .map((l) => l.knownName?.en || l.orgName?.en || 'Неизвестно')
        .join(', ')

      return {
        id: `${prize.awardYear}-${prize.category.en}-${idx}`,
        category: this.translateCategory(prize.category.en),
        awardYear: prize.awardYear,
        prizeAmount: prize.prizeAmount || 0,
        dateAwarded: prize.dateAwarded || `${prize.awardYear}-12-10`,
        laureatesList: names || 'Премия не присуждалась',
        laureatesCount: laureates.length
      }
    })

    return {
      items,
      total: data.meta.count
    }
  }

  private translateCategory(cat: string): string {
    const dict: Record<string, string> = {
      'Physics': 'Физика',
      'Chemistry': 'Химия',
      'Physiology or Medicine': 'Физиология и медицина',
      'Literature': 'Литература',
      'Peace': 'Премия мира',
      'Economic Sciences': 'Экономические науки'
    }
    return dict[cat] || cat
  }
}

export const prizesService = new PrizesService()

