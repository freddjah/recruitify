'use strict'

const moment = require('moment')
const sinon = require('sinon')
const clearDatabase = require('../../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Controllers/Http/ApiController')
const ApiController = use('App/Controllers/Http/ApiController')
const Factory = use('Factory')
const Person = use('App/Models/Person')
const CompetenceProfile = use('App/Models/CompetenceProfile')
const Availability = use('App/Models/Availability')

const response = { send: sinon.spy() }
const controller = new ApiController()

const antl = { currentLocale: () => 'en', formatMessage: id => id }

beforeEach(async () => {

  await clearDatabase()
  response.send.resetHistory()
})

test('getCompetences: Responds with competences', async () => {

  const competences = await Factory.model('App/Models/Competence').createMany(2)

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

test('getStatuses: Responds with statuses', async () => {

  await controller.getStatuses({ response, antl })

  sinon.assert.calledWith(response.send, {
    statuses: {
      unhandled: 'recruiter.unhandled',
      accepted: 'recruiter.accepted',
      rejected: 'recruiter.rejected',
    },
  })
})

test('login: Responds with JWT if login was successful', async () => {

  const person = await Factory.model('App/Models/Person').create()
  const request = { post: () => ({ username: 'my-username', password: 'my-password' }) }
  const auth = {
    authenticator: () => ({
      generate: () => ({
        token: 'my-jwt-token',
        type: 'Bearer',
      }),
      validate: () => person,
    }),
  }

  await controller.login({ request, response, auth })

  sinon.assert.calledWith(response.send, {
    token: 'my-jwt-token',
    type: 'Bearer',
  })
})

test('register: a person was created and responds with message', async ({ assert }) => {

  const request = {
    post: () => ({
      name: 'Anders',
      surname: 'Andersson',
    }),
  }

  await controller.register({ request, response, antl })

  const person = await Person.first()
  assert.equal(person.name, 'Anders')
  assert.equal(person.surname, 'Andersson')

  sinon.assert.calledWith(response.send, {
    message: 'authentication.registerDoneApi',
  })
})

test('saveApplication: creates an application', async ({ assert }) => {

  const person = await Factory.model('App/Models/Person').create()
  const competences = await Factory.model('App/Models/Competence').createMany(2)

  const request = {
    post: () => ({
      expertiseCompetenceId: competences.map(({ competence_id: id }) => id),
      expertiseYearsOfExperience: [3, 10],
      availabilityFrom: ['2019-01-01', '2019-05-01'],
      availabilityTo: ['2019-01-31', '2019-05-31'],
    }),
  }
  const auth = {
    getUser: () => person,
  }

  await controller.saveApplication({ request, response, auth, antl })

  // Validate person
  const todayDate = moment().format('YYYY-MM-DD')
  assert.equal(todayDate, person.application_date)
  assert.equal('unhandled', person.application_status)
  assert.isNull(person.application_reviewed_at)

  // Validate competence profiles
  const competenceProfiles = await CompetenceProfile.all()
  const competenceProfile = competenceProfiles.rows[0]
  assert.lengthOf(competenceProfiles.rows, 2)
  assert.equal(competenceProfile.competence_id, competences[0].competence_id)
  assert.equal(competenceProfile.years_of_experience, 3)

  // Validate availabilities
  const availabilites = await Availability.all()
  const availability = availabilites.rows[0]
  assert.lengthOf(availabilites.rows, 2)
  assert.equal(availability.person_id, person.person_id)
  assert.equal(availability.from_date, '2019-01-01')
  assert.equal(availability.to_date, '2019-01-31')

  sinon.assert.calledWith(response.send, {
    message: 'applicant.flashMessage',
  })
})

test('searchResults: Responds with persons (applicants only) and paginator', async ({ assert }) => {

  await Factory.model('App/Models/Person').createMany(5)
  await Factory.model('App/Models/Person').create({ role: 'recruiter' })

  const request = { get: () => ({}) }
  await controller.searchResults({ antl, request, response })

  const answer = response.send.args[0][0]
  assert.lengthOf(answer.persons, 5)
  assert.deepEqual(answer.paginator, { total: 5, perPage: 10, page: 1, lastPage: 1 })
})

test('view: Responds with person, availabilities and competence profiles', async ({ assert }) => {

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

  const params = { personId: person_id }
  await controller.view({ params, response, antl })

  const call = response.send.args[0][0]
  assert.equal(call.person.person_id, person_id)
  assert.lengthOf(call.availabilities, 3)
  assert.lengthOf(call.competenceProfiles, 2)
})

test('updateStatus: Updates application data and returns response message', async ({ assert }) => {

  const person = await Factory.model('App/Models/Person').create({
    applicationStatus: 'unhandled',
  })
  const request = {
    post: () => ({ applicationStatus: 'rejected' }),
  }
  const params = { personId: person.person_id }

  await controller.updateStatus({ request, response, params, antl })

  await person.reload()
  const currentTime = moment().format('YYYY-MM-DD HH:mm:ss')
  assert.equal(person.application_status, 'rejected')
  assert.equal(person.application_reviewed_at, currentTime)

  sinon.assert.calledWith(response.send, {
    message: 'recruiter.updateFlashMessage',
  })
})
