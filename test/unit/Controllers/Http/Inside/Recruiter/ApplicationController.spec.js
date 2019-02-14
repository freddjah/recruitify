'use strict'

const moment = require('moment')
const sinon = require('sinon')
const clearDatabase = require('../../../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Controllers/Http/Inside/Recruiter/ApplicationController')
const ApplicationController = use('App/Controllers/Http/Inside/Recruiter/ApplicationController')

const Factory = use('Factory')
const response = { redirect: sinon.spy() }
const view = { render: sinon.spy() }
const controller = new ApplicationController()

const antl = { formatMessage: () => 'my message' }

beforeEach(async () => {

  await clearDatabase()
  response.redirect.resetHistory()
  view.render.resetHistory()
})

test('index: Redirect to /recruiter/applications', async () => {

  await controller.index({ response })

  sinon.assert.calledWith(response.redirect, '/recruiter/applications')
})

test('searchForm: Displays form and includes competences from db', async ({ assert }) => {

  const competence = await Factory.model('App/Models/Competence').create()

  await controller.searchForm({ view })

  // Get competences sent to view
  const competencesFromController = view.render.args[0][1].competences.rows

  // Check if created competence is found in returned list
  assert.equal(competencesFromController[0].competence_id, competence.competence_id)
  assert.equal(competencesFromController[0].name_en, competence.name_en)
  assert.equal(competencesFromController[0].name_en_gb, competence.name_en_gb)
  assert.equal(competencesFromController[0].name_sv, competence.name_sv)

  sinon.assert.calledWith(view.render, 'inside.recruiter.application.search-form')
})

test('searchResults: Responds with persons and paginator', async ({ assert }) => {

  await Factory.model('App/Models/Person').createMany(5)
  await Factory.model('App/Models/Person').create({ role: 'recruiter' })

  const request = { get: () => ({}) }
  await controller.searchResults({ view, request })

  const answer = view.render.args[0][1]
  assert.lengthOf(answer.persons.rows, 5)
  assert.deepEqual(answer.persons.pages, { total: 5, perPage: 10, page: 1, lastPage: 1 })

  sinon.assert.calledWith(view.render, 'inside.recruiter.application.search-results')
})

test('view: Responds with a specific application view, including person, availabilities and competence profiles', async ({ assert }) => {

  const person = await Factory.model('App/Models/Person').create()
  const { person_id } = person // eslint-disable-line camelcase
  await Factory.model('App/Models/Availability').createMany(3, { person_id })
  const competences = await Factory.model('App/Models/Competence').createMany(2)
  await Factory.model('App/Models/CompetenceProfile').create({
    competence_id: competences[0].competence_id,
    person_id,
  })
  await Factory.model('App/Models/CompetenceProfile').create({
    competence_id: competences[1].competence_id,
    person_id,
  })

  const request = { get: () => ({}) }
  const params = { personId: person_id }
  await controller.view({ params, request, view })

  const answer = view.render.args[0][1]
  assert.equal(answer.person.person_id, person_id)
  assert.lengthOf(answer.availabilities.rows, 3)
  assert.lengthOf(answer.competenceProfiles.rows, 2)

  sinon.assert.calledWith(view.render, 'inside.recruiter.application.view')
})

test('updateStatus: Updates application data and returns response message', async ({ assert }) => {

  const person = await Factory.model('App/Models/Person').create({
    applicationStatus: 'unhandled',
  })
  const request = {
    post: () => ({ applicationStatus: 'rejected' }),
  }
  const params = { personId: person.person_id }
  const session = {
    flash: () => {},
  }

  await controller.updateStatus({ request, response, session, params, antl })

  await person.reload()
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
  assert.equal(person.application_status, 'rejected')
  assert.equal(person.application_reviewed_at, currentTime)

  sinon.assert.calledWith(response.redirect, 'back')
})
