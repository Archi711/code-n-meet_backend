import { RequestValidationSchema } from '../types/index'
import * as Yup from 'yup'
import { GroupType } from '@prisma/client'
export const LoginRequestDataValidation: RequestValidationSchema = {
  body: Yup.object({
    login: Yup.string().strict().required(),
    password: Yup.string().strict().required(),
  }),
}

export const RegisterRequestDataValidation: RequestValidationSchema = {
  body: Yup.object({
    login: Yup.string()
      .matches(
        /^(?=[a-zA-Z0-9._]{8,20}$)(?!.*[_.]{2})[^_.].*[^_.]$/,
        'Username must contain only alphanumeric characters, underscore or dot - min 8 - max 20 characters'
      )
      .min(8)
      .max(20)
      .required()
      .trim()
      .strict(),
    password: Yup.string()
      .strict()
      .required()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    email: Yup.string().email().required(),
  }),
}

export const GetByIdValidation: RequestValidationSchema = {
  params: Yup.object({
    id: Yup.number().required(),
  }),
}

export const GetUserGroupsValidation: RequestValidationSchema = {
  query: Yup.object({
    id: Yup.number().required(),
    privacy: Yup.string().oneOf(['all', 'private', 'public']).required(),
  }),
}

export const CreateGroupValidation: RequestValidationSchema = {
  body: Yup.object({
    name: Yup.string().min(2).max(64).required(),
    description: Yup.string().max(1000).required(),
    type: Yup.string().oneOf(Object.keys(GroupType)).required(),
    isPrivate: Yup.bool(),
    repoLink: Yup.string(),
  }),
}

export const CreatePostValidation: RequestValidationSchema = {
  body: Yup.object({
    title: Yup.string().min(3).max(255).required(),
    content: Yup.string().min(32).max(16000).required(),
  }),
}

export const EditProfileValidation: RequestValidationSchema = {
  body: Yup.object({
    password: Yup.string()
      .strict()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
        'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character'
      ),
    email: Yup.string().email(),
    name: Yup.string(),
    profileDescription: Yup.string(),
    githubNick: Yup.string(),
    connectWithGithub: Yup.bool(),
  }),
}

export const DeleteUserValidation: RequestValidationSchema = {
  body: Yup.object({
    id: Yup.number().required(),
    password: Yup.string().required(),
  }),
}

export const AddUserToGroupValidation: RequestValidationSchema = {
  params: Yup.object({
    id: Yup.number().required(),
  }),
  body: Yup.object({
    login: Yup.string().optional(),
    id: Yup.number().optional(),
  }),
}

export const RemoveUserFromGroupValidation: RequestValidationSchema = {
  params: Yup.object({
    id: Yup.number().required(),
  }),
  body: Yup.object({
    id: Yup.number().required(),
  }),
}

export const EditPostValidation: RequestValidationSchema = {
  params: Yup.object({
    id: Yup.number().required(),
  }),
  body: Yup.object({
    idGroup: Yup.number().required(),
    idUser: Yup.number().required(),
    id: Yup.number().required(),
    title: Yup.string().min(3).max(255),
    content: Yup.string().min(32).max(16000),
  })
}
