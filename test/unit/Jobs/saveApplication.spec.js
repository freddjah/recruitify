'use strict'

const clearDatabase = require('../../clearDatabase')

const { test, beforeEach } = use('Test/Suite')('Jobs/saveApplication')
const saveApplication = use('App/Jobs/saveApplication')

const Factory = use('Factory')

beforeEach(async () => {

  await clearDatabase()
})

test('saveApplication: Saves properly', async ({ assert }) => {

  const person = await Factory.model('App/Models/Person').create()
  const competence = await Factory.model('App/Models/Competence').create()

  const data = {
    expertiseCompetenceId: [competence.competence_id],
    expertiseYearsOfExperience: ['5'],
    availabilityFrom: ['2018-05-20'],
    availabilityTo: ['2018-06-10'],
  }

  await saveApplication(person, data)

  const competenceProfiles = await person.competenceProfiles().fetch()
  const availabilities = await person.availabilities().fetch()

  // Competence profile is the same as data passed in
  assert.equal(competenceProfiles.rows.length, 1)
  assert.equal(competenceProfiles.rows[0].competence_id, data.expertiseCompetenceId[0])
  assert.equal(competenceProfiles.rows[0].years_of_experience, data.expertiseYearsOfExperience[0])

  // Availability is the same as data passed in
  assert.equal(availabilities.rows.length, 1)
  assert.equal(availabilities.rows[0].from_date, data.availabilityFrom[0])
  assert.equal(availabilities.rows[0].to_date, data.availabilityTo[0])

  await person.reload()

  // Correct fields set on person
  assert.equal(person.application_status, 'unhandled')
  assert.equal(person.application_reviewed_at, null)
  assert.exists(person.application_date)
})
