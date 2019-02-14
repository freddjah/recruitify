'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Middleware/Role')
const Role = use('App/Middleware/Role')

const role = new Role()
const auth = {
  getUser: () => ({
    role: () => ({
      fetch: () => ({
        name: 'applicant',
      }),
    }),
  }),
}

beforeEach(async () => {
  await clearDatabase()
})

test('handle: Throws UnauthorizedException if invalid role', async ({ assert }) => {

  const next = sinon.spy()

  try {
    await role.handle({ auth }, next, ['recruiter'])
    assert.equal(false, true, 'error was not thrown')
  } catch (err) {
    assert.equal(err.constructor.name, 'UnauthorizedException')
  }

  sinon.assert.notCalled(next)
})

test('handle: Calls next function if valid role', async () => {

  const next = sinon.spy()

  await role.handle({ auth }, next, ['applicant'])

  sinon.assert.calledOnce(next)
})
