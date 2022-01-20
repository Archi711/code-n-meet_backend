import { GetUserGroupsValidation } from './../validations/index'
import express from 'express'
import validate from './../middleware/validate'
import UserController from './controllers/user.controller'
import {
  LoginRequestDataValidation,
  RegisterRequestDataValidation,
} from '../validations/index'
import GroupController from './controllers/group.controller'

const router = express()

// ///////////////////////////////////////
// auth routes
// ///////////////////////////////////////
router.post(
  '/login',
  validate(LoginRequestDataValidation),
  UserController.login
)
router.post(
  '/signup',
  validate(RegisterRequestDataValidation),
  UserController.signup
)

// //////////////////////////////////////
// user REST
// //////////////////////////////////////
router.get('/users/:id', UserController.getById)

// /////////////////////////////////////
// group REST
// /////////////////////////////////////

router.get(
  '/groups',
  [validate(GetUserGroupsValidation)],
  GroupController.getUserGroups
)

export default router
