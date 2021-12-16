import { AnySchema } from 'yup'

export type LoginRequestData = {
  login: string
  password: string
}

export type RegisterRequestData = {
  login: string
  password: string
  email: string
}

export type RequestValidationSchema = {
  body?: AnySchema
  query?: AnySchema
  params?: AnySchema
}
