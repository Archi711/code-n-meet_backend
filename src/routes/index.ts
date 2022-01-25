import {
  CreateGroupValidation,
  CreatePostValidation,
  EditProfileValidation,
  GetByIdValidation,
  GetUserGroupsValidation,
} from './../validations/index'
import express from 'express'
import validate from './../middleware/validate'
import UserController from './controllers/user.controller'
import {
  LoginRequestDataValidation,
  RegisterRequestDataValidation,
} from '../validations/index'
import GroupController from './controllers/group.controller'
import jwt from '../middleware/jwt'
import PostController from './controllers/post.controller'

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
router.patch(
  '/users/:id',
  [jwt, validate(EditProfileValidation)],
  UserController.updateUser
)

// /////////////////////////////////////
// group REST
// /////////////////////////////////////

router.get(
  '/users/:id/groups',
  [validate(GetUserGroupsValidation)],
  GroupController.getUserGroups
)

router.get(
  '/groups/:id',
  [validate(GetByIdValidation)],
  GroupController.getGroupById
)

router.post(
  '/groups',
  [jwt, validate(CreateGroupValidation)],
  GroupController.createGroup
)

router.get('/groups', GroupController.getGroups)

// ///////////////////////////////////
// posts REST
// ///////////////////////////////////

router.get(
  '/groups/:id/posts',
  [validate(GetByIdValidation)],
  PostController.getGroupPosts
)

router.get(
  '/users/:id/posts',
  [validate(GetByIdValidation)],
  PostController.getUserPosts
)

router.post(
  '/posts',
  [jwt, validate(CreatePostValidation)],
  PostController.addPost
)

router.get('/posts/:id', [validate(GetByIdValidation)], PostController.getPost)

export default router
