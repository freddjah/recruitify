'use strict'

const sinon = require('sinon')
const clearDatabase = require('../../../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Controllers/Http/Inside/Applicant/ApplicationController')
const ApiController = use('App/Controllers/Http/Inside/Applicant/ApplicationController')
const PersonRepository = use('App/Repositories/PersonRepository')

const Factory = use('Factory')
const response = { redirect: sinon.spy() }
const view = { render: sinon.spy() }
const controller = new ApiController()

beforeEach(async () => {

  await clearDatabase()
  response.redirect.resetHistory()
  view.render.resetHistory()
})

test('index: Redirect to /applicant/application', async () => {

  controller.index({ response })

  sinon.assert.calledWith(response.redirect, '/applicant/application')
})

test('applicationForm: Displays form and includes competences from db', async ({ assert }) => {

  const competence = await Factory.model('App/Models/Competence').create()

  await controller.applicationForm({ view })

  // Get competences sent to view
  const competencesFromController = view.render.args[0][1].competences.rows

  // Check if created competence is found in returned list
  assert.equal(competencesFromController[0].competence_id, competence.competence_id)
  assert.equal(competencesFromController[0].name_en, competence.name_en)
  assert.equal(competencesFromController[0].name_en_gb, competence.name_en_gb)
  assert.equal(competencesFromController[0].name_sv, competence.name_sv)

  sinon.assert.calledWith(view.render, 'inside.applicant.application.application-form')
})

test('saveApplication: Saves application', async ({ assert }) => {
  const personBefore = await Factory.model('App/Models/Person').create()
  const competence = await Factory.model('App/Models/Competence').create()

  const data = {
    expertiseCompetenceId: [competence.competence_id],
    expertiseYearsOfExperience: ['1'],
    availabilityFrom: ['2018-05-15'],
    availabilityTo: ['2018-06-15'],
  }

  const auth = { getUser() { return personBefore } }
  const session = { flash() {} }
  const antl = { formatMessage() {} }
  const request = { post() { return data } }

  await controller.saveApplication({ request, response, session, auth, antl })

  // Fetch updated person
  const personAfter = await PersonRepository.findById(personBefore.person_id)

  // Checking fields set on person
  assert.equal(personAfter.application_status, 'unhandled')
  assert.equal(personAfter.application_reviewed_at, null)

  const availabilities = await personAfter.availabilities().fetch()
  const competenceProfiles = await personAfter.competenceProfiles().fetch()

  // Checking created availabilities and competence profiles
  assert.equal(availabilities.rows[0].from_date, data.availabilityFrom)
  assert.equal(availabilities.rows[0].to_date, data.availabilityTo)
  assert.equal(competenceProfiles.rows[0].competence_id, data.expertiseCompetenceId)
  assert.equal(competenceProfiles.rows[0].years_of_experience, data.expertiseYearsOfExperience)

  sinon.assert.calledWith(response.redirect, 'back')
})
