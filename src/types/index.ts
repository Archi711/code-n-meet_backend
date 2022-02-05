import { AnySchema } from 'yup'

export type LoginRequestData = {
  login: string
  password: string
}

export type UserData = {
  id: number
  name: string
  email: string
  githubNick?: string
  connectToGithub?: boolean
  profileDescription?: string
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

export type PostBody = {
  title: string
  content: string
  idGroup: number
}

export enum GroupType {
  LANGUAGE = 'LANGUAGE',
  PROJECT = 'PROJECT',
  COMPANY = "COMPANY",
  COMMUNITY = 'COMMUNITY'
}

export type GroupCreateBody = {
  name: string
  description: string
  type: GroupType,
  isPrivate: boolean
  repoLink?: string
}

export type EditProfileData = Partial<Omit<UserData, 'id'> & {
  password: string
}>

export type EditPostData = {
  title?: string
  content?: string
  idGroup: number
  idUser: number
  id: number
}

export type EditGroupData = Partial<GroupCreateBody>
