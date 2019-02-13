'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('ApiController')
const ApiController = use('App/Controllers/Http/ApiController')

const Factory = use('Factory')
const response = { send: sinon.spy() }
const controller = new ApiController()

beforeEach(async () => {

  await clearDatabase()
  response.send.resetHistory()
})

test('getCompetences: Respond with competences', async () => {

  const competences = await Factory.model('App/Models/Competence').createMany(2)
  const antl = { currentLocale: () => 'en' }

  await controller.getCompetences({ response, antl })

  sinon.assert.calledWith(response.send, {
    competences: [
      {
        competence_id: competences[0].competence_id,
        name: competences[0].name_en,
      },
      {
        competence_id: competences[1].competence_id,
        name: competences[1].name_en,
      },
    ],
  })
})

test('getStatuses: Respond with statuses', async () => {

  await controller.getStatuses({ response })

  sinon.assert.calledWith(response.send, {
    statuses: {
      unhandled: 'Unhandled',
      approved: 'Approved',
      rejected: 'Rejected',
    },
  })
})
