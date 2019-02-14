'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Controllers/Http/HomeController')
const HomeController = use('App/Controllers/Http/HomeController')

const response = { send: sinon.spy(), redirect: sinon.spy() }
const controller = new HomeController()

beforeEach(async () => {

  await clearDatabase()
  response.send.resetHistory()
})

test('home: Renders the home page for specific role', async () => {

  const auth = {
    getUser: () => ({
      role: () => ({
        fetch: () => ({
          name: 'applicant',
        }),
      }),
    }),
  }
  await controller.home({ auth, response })
  sinon.assert.calledWith(response.redirect, '/applicant')
})
