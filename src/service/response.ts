import { NextApiResponse } from 'next'

export interface ResponseType<T = any> {
  code: number
  message: string
  data: T
}

export const JsonRes = <T = any>(
  res: NextApiResponse,
  props?: {
    code?: number
    message?: string
    data?: T
    error?: any
  }
) => {
  const { code = 200, message = '', data = null, error } = props || {}

  let msg = message

  if (code < 200 || code > 300) {
    msg = error?.message || '请求错误'
  }

  res.json({
    code,
    message: msg,
    data,
  })
}
