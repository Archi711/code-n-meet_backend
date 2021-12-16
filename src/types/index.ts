export type LoginRequestData = {
  login: string
  password: string
}

export type RegisterRequestData = {
  login: string
  password: string
  email: string
}

export type RequestDataTypes = LoginRequestData | RegisterRequestData
