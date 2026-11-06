import * as t from 'io-ts'
import * as E from 'fp-ts/lib/Either'
import { PathReporter } from 'io-ts/lib/PathReporter'

/**
 * Валидирует и декодирует данные в соответствии с заданным io-ts кодеком.
 * Использует fp-ts Either (isRight / isLeft) для строгой обработки результата валидации.
 *
 * @param codec - io-ts кодек (t.Type)
 * @param data - сырые входящие данные любого типа (например, ответ axios)
 * @returns Гарантированно типизированный объект типа A
 * @throws Error с подробным отчетом от PathReporter в случае несоответствия схемы
 */
export function decodeOrThrow<A, O, I>(codec: t.Type<A, O, I>, data: I): A {
  const result = codec.decode(data)

  if (E.isLeft(result)) {
    const errorList = PathReporter.report(result)
    const formattedErrors = errorList.map((err) => ` - ${err}`).join('\n')
    const message = `[io-ts Validation Failed]: Полученные от API данные не соответствуют схеме:\n${formattedErrors}`
    console.error(message, { receivedData: data })
    throw new Error(message)
  }

  // При успешном декодировании возвращаем типизированный объект
  return result.right
}

