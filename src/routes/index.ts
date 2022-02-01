import {
  AddUserToGroupValidation,
  CreateGroupValidation,
  CreatePostValidation,
  DeleteUserValidation,
  EditProfileValidation,
  GetByIdValidation,
  GetUserGroupsValidation,
} from './../validations/index'
import express, { NextFunction, Request, Response } from 'express'
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
router.get('/users/:id', [jwt(true)], UserController.getById)
router.patch(
  '/users/:id',
  [jwt(), validate(EditProfileValidation)],
  UserController.updateUser
)

router.delete('/users/:id', [jwt(), validate(DeleteUserValidation)], UserController.deleteUser)

// /////////////////////////////////////
// group REST
// /////////////////////////////////////

router.get(
  '/users/:id/groups',
  [jwt(true), validate(GetUserGroupsValidation)],
  GroupController.getUserGroups
)

router.get(
  '/groups/:id',
  [jwt(true), validate(GetByIdValidation)],
  GroupController.getGroupById
)

router.post(
  '/groups',
  [jwt(), validate(CreateGroupValidation)],
  GroupController.createGroup
)

router.post(
  '/groups/:id/addUserToGroup',
  [jwt(), validate(AddUserToGroupValidation)],
  GroupController.addUserToGroup
)

router.get('/groups', GroupController.getGroups)

// ///////////////////////////////////
// posts REST
// ///////////////////////////////////

router.get(
  '/groups/:id/posts',
  [jwt(true), validate(GetByIdValidation)],
  PostController.getGroupPosts
)

router.get(
  '/users/:id/posts',
  [jwt(true), validate(GetByIdValidation)],
  PostController.getUserPosts
)

router.post(
  '/posts',
  [jwt(), validate(CreatePostValidation)],
  PostController.addPost
)

router.get('/posts', [jwt(true)], PostController.getPosts)

router.get('/posts/:id', [validate(GetByIdValidation)], PostController.getPost)

export default router
