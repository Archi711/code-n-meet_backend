import express from 'express'
import validate from './../middleware/validate'
import UserController from './controllers/user.controller'
import {
  LoginRequestDataValidation,
  RegisterRequestDataValidation,
} from '../validations/index'

const router = express()

/////////////////////////////////////////
// auth routes
/////////////////////////////////////////
router.post(
  '/login',
  validate(LoginRequestDataValidation),
  UserController.login
)
router.post(
  '/register',
  validate(RegisterRequestDataValidation),
  UserController.register
)

export default router
