'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('AuthenticationController')
const AuthenticationController = use('App/Controllers/Http/Outside/AuthenticationController')

const Person = use('App/Models/Person')
const response = { send: sinon.spy(), redirect: sinon.spy() }
const view = { render: sinon.spy() }
const controller = new AuthenticationController()

beforeEach(async () => {

  await clearDatabase()
  response.send.resetHistory()
})

test('register form: Renders register form', async () => {
  controller.registerForm({ view })
  sinon.assert.calledWith(view.render, 'outside.authentication.register-form')
})

test('register: Respond with redirect login', async ({ assert }) => {

  const request = { all: () => ({ name: 'name', surname: 'surname' }) }

  await controller.register({ response, request })
  const person = await Person.first()
  assert.equal(person.name, 'name')
  assert.equal(person.surname, 'surname')
})

test('register done: Renders register done page', async () => {
  controller.registerDone({ view })
  sinon.assert.calledWith(view.render, 'outside.authentication.register-done')
})

test('login form: Renders login form', async () => {
  controller.loginForm({ view })
  sinon.assert.calledWith(view.render, 'outside.authentication.login-form')
})

test('login: Redirects to https://example.com/', async () => {

  const request = { all: () => ({ username: 'a-username', password: 'a-password' }) }
  const auth = {
    attempt: () => {},
  }
  const session = {
    pull: () => 'https://example.com/',
  }

  await controller.login({ auth, request, response, session })
  sinon.assert.calledWith(response.redirect, 'https://example.com/')
})

test('logout: Redirects to https://example.com/', async () => {

  const auth = {
    logout: () => {},
  }

  await controller.logout({ auth, response })
  sinon.assert.calledWith(response.redirect, 'https://example.com/')
})
