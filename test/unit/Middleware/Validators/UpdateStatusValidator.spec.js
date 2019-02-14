'use strict'

const moment = require('moment')

const clearDatabase = require('../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Middleware/Validators/UpdateStatusValidator')
const UpdateStatusValidator = use('App/Middleware/Validators/UpdateStatusValidator')

const Factory = use('Factory')
const validator = new UpdateStatusValidator()

beforeEach(async () => {

  await clearDatabase()
})

test('customValidation: Conflicting updates renders error', async ({ assert }) => {
  const person = await Factory.model('App/Models/Person').create()
  person.application_reviewed_at = moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss')
  await person.save()

  const request = {
    post() {
      return {
        reviewTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
    },
  }

  const errors = await validator.customValidation({
    request,
    params: {
      personId: person.person_id,
    },
  })

  assert.equal(errors[0].field, 'applicationStatus')
  assert.equal(errors[0].validation, 'conflictingUpdates')
})

test('customValidation: No conflicting update returns no errors', async ({ assert }) => {
  const person = await Factory.model('App/Models/Person').create()
  person.application_reviewed_at = moment().format('YYYY-MM-DD HH:mm:ss')
  await person.save()

  const request = {
    post() {
      return {
        reviewTime: moment().add(1, 'hour').format('YYYY-MM-DD HH:mm:ss'),
      }
    },
  }

  const errors = await validator.customValidation({
    request,
    params: {
      personId: person.person_id,
    },
  })

  assert.equal(errors.length, 0)
})
