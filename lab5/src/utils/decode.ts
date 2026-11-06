import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'

export function decodeOrThrow<A, O, I>(codec: t.Type<A, O, I>, data: I): A {
  const result = codec.decode(data)

  if (E.isLeft(result)) {
    const errorList = PathReporter.report(result)
    const formattedErrors = errorList.map((err) => ` - ${err}`).join('\n')
    const message = `[io-ts Validation Failed]: Полученные от API данные не соответствуют схеме:\n${formattedErrors}`
    console.error(message, { receivedData: data })
    throw new Error(message)
  }

  return result.right
}

