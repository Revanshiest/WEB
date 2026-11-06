import * as t from 'io-ts'

export const TranslationTextCodec = t.record(t.string, t.string)

export const MetaInfoCodec = t.intersection([
  t.type({
    offset: t.number,
    limit: t.number,
    count: t.number
  }),
  t.partial({
    terms: t.string,
    license: t.string
  })
])

/* ==========================================
   КОДЕКИ ДЛЯ НОБЕЛЕВСКИХ ПРЕМИЙ (Prizes)
   ========================================== */

export const ApiPrizeLaureateCodec = t.intersection([
  t.type({
    id: t.string
  }),
  t.partial({
    knownName: TranslationTextCodec,
    orgName: TranslationTextCodec,
    portion: t.string,
    motivation: TranslationTextCodec
  })
])

export const ApiNobelPrizeCodec = t.intersection([
  t.type({
    awardYear: t.string,
    category: TranslationTextCodec
  }),
  t.partial({
    categoryFullName: TranslationTextCodec,
    dateAwarded: t.string,
    prizeAmount: t.number,
    laureates: t.array(ApiPrizeLaureateCodec)
  })
])

export const PrizesApiResponseCodec = t.type({
  nobelPrizes: t.array(ApiNobelPrizeCodec),
  meta: MetaInfoCodec
})

export type ApiNobelPrize = t.TypeOf<typeof ApiNobelPrizeCodec>
export type PrizesApiResponse = t.TypeOf<typeof PrizesApiResponseCodec>

/* ==========================================
   КОДЕКИ ДЛЯ ЛАУРЕАТОВ (Laureates)
   ========================================== */

export const LaureatePrizeInfoCodec = t.type({
  awardYear: t.string,
  category: TranslationTextCodec
})

export const ApiPlaceInfoCodec = t.partial({
  city: TranslationTextCodec,
  country: TranslationTextCodec
})

export const ApiDatePlaceCodec = t.partial({
  date: t.string,
  place: ApiPlaceInfoCodec
})

export const ApiLaureateCodec = t.intersection([
  t.type({
    id: t.string
  }),
  t.partial({
    knownName: TranslationTextCodec,
    orgName: TranslationTextCodec,
    birth: ApiDatePlaceCodec,
    founded: ApiDatePlaceCodec,
    nobelPrizes: t.array(LaureatePrizeInfoCodec)
  })
])

export const LaureatesApiResponseCodec = t.type({
  laureates: t.array(ApiLaureateCodec),
  meta: MetaInfoCodec
})

export type ApiLaureate = t.TypeOf<typeof ApiLaureateCodec>
export type LaureatesApiResponse = t.TypeOf<typeof LaureatesApiResponseCodec>

