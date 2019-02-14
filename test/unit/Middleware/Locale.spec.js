'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Middleware/Locale')
const Locale = use('App/Middleware/Locale')

const locale = new Locale()
const antl = {
  currentLocale: () => 'en',
  formatMessage: () => 'my message',
  switchLocale: sinon.spy(),
}
const session = {
  put: sinon.spy(),
  get: () => 'en-gb',
}
const response = {
  redirect: sinon.spy(() => 'redirect'),
}
const view = {
  share: sinon.spy(),
}

beforeEach(async () => {
  await clearDatabase()
})

test('handle: Returns with redirect if locale was specified as GET parameter', async ({ assert }) => {

  const request = { get: () => ({ locale: 'sv' }) }

  const myResponse = await locale.handle({ antl, request, session, response, view })

  sinon.assert.calledWith(session.put, 'locale', 'sv')
  sinon.assert.calledWith(response.redirect, 'back')
  assert.equal(myResponse, 'redirect')
})

test('handle: Switches locales and shares it to view. Calls next function', async ({ assert }) => {

  const request = { get: () => ({}) }
  const next = sinon.spy()

  await locale.handle({ antl, request, session, response, view }, next)

  sinon.assert.calledWith(antl.switchLocale, 'en-gb')
  sinon.assert.calledWith(view.share, { currentLocale: 'en_gb' })
  sinon.assert.calledOnce(next)
})
