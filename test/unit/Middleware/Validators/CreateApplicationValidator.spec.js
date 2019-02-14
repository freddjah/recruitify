'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Validators/CreateApplicationValidator')
const CreateApplicationValidator = use('App/Middleware/Validators/CreateApplicationValidator')

const Factory = use('Factory')
const validator = new CreateApplicationValidator()

beforeEach(async () => {

  await clearDatabase()
})

test('customValidation: Empty form returns errors', async ({ assert }) => {
  const request = {
    post() {
      return {
        expertiseCompetenceId: [],
        expertiseYearsOfExperience: [],
        availabilityFrom: [],
        availabilityTo: [],
      }
    },
  }

  const errors = await validator.customValidation({ request })

  assert.equal(errors[0].field, 'expertises')
  assert.equal(errors[0].validation, 'empty')
  assert.equal(errors[1].field, 'availabilities')
  assert.equal(errors[1].validation, 'empty')
})

test('customValidation: Lengths of lists must be the same', async ({ assert }) => {
  const competence = await Factory.model('App/Models/Competence').create()

  const request = {
    post() {
      return {
        expertiseCompetenceId: [competence.competence_id],
        expertiseYearsOfExperience: ['1', '2'],
        availabilityFrom: ['2015-05-18'],
        availabilityTo: ['2015-05-18', '2015-05-20'],
      }
    },
  }

  const errors = await validator.customValidation({ request })

  assert.equal(errors[0].field, 'expertises')
  assert.equal(errors[0].validation, 'length')
  assert.equal(errors[1].field, 'availabilities')
  assert.equal(errors[1].validation, 'length')
})

test('customValidation: Competence ids must exist in database', async ({ assert }) => {
  const competence = await Factory.model('App/Models/Competence').create()

  const request = {
    post() {
      return {
        expertiseCompetenceId: [competence.competence_id, '4'],
        expertiseYearsOfExperience: ['1', '2'],
        availabilityFrom: ['2015-05-18', '2015-05-19'],
        availabilityTo: ['2015-05-18', '2015-05-20'],
      }
    },
  }

  const errors = await validator.customValidation({ request })

  assert.equal(errors[0].field, 'expertises')
  assert.equal(errors[0].validation, 'length')
})

test('customValidation: Years of experience must be between 1-99', async ({ assert }) => {
  const competence = await Factory.model('App/Models/Competence').create()

  const request = {
    post() {
      return {
        expertiseCompetenceId: [competence.competence_id],
        expertiseYearsOfExperience: ['150'],
        availabilityFrom: ['2015-05-18', '2015-05-19'],
        availabilityTo: ['2015-05-18', '2015-05-20'],
      }
    },
  }

  const errors = await validator.customValidation({ request })

  assert.equal(errors[0].field, 'expertises')
  assert.equal(errors[0].validation, 'years')
})

test('customValidation: Availability from date must be before availability to date', async ({ assert }) => {
  const competence = await Factory.model('App/Models/Competence').create()

  const request = {
    post() {
      return {
        expertiseCompetenceId: [competence.competence_id],
        expertiseYearsOfExperience: ['15'],
        availabilityFrom: ['2015-05-20'],
        availabilityTo: ['2015-05-18'],
      }
    },
  }

  const errors = await validator.customValidation({ request })

  assert.equal(errors[0].field, 'availabilities')
  assert.equal(errors[0].validation, 'dates')
})

test('customValidation: A correct form returns no errors', async ({ assert }) => {
  const competence = await Factory.model('App/Models/Competence').create()

  const request = {
    post() {
      return {
        expertiseCompetenceId: [competence.competence_id],
        expertiseYearsOfExperience: ['15'],
        availabilityFrom: ['2015-02-12'],
        availabilityTo: ['2015-05-18'],
      }
    },
  }

  const errors = await validator.customValidation({ request })

  assert.equal(errors.length, 0)
})
