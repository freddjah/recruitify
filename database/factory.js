'use strict'

const moment = require('moment')

function date(timestamp, format = 'YYYY-MM-DD') {
  return moment(timestamp * 1000).format(format)
}

function dateTime(timestamp) {
  return moment(timestamp * 1000).format('YYYY-MM-DD HH:mm:ss')
}

/*
|--------------------------------------------------------------------------
| Factory
|--------------------------------------------------------------------------
|
| Factories are used to define blueprints for database tables or Lucid
| models. Later you can use these blueprints to seed your database
| with dummy data.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')
const Hash = use('Hash')

Factory.blueprint('App/Models/Availability', (faker, _, data) => ({
  person_id: data.person_id,
  from_date: date(faker.timestamp()),
  to_date: date(faker.timestamp()),
}))

Factory.blueprint('App/Models/Competence', faker => ({
  name_sv: faker.word(),
  name_en: faker.word(),
  name_en_gb: faker.word(),
}))

Factory.blueprint('App/Models/CompetenceProfile', (faker, _, data) => ({
  person_id: data.person_id,
  competence_id: data.competence_id,
  years_of_experience: faker.year(),
}))

Factory.blueprint('App/Models/Person', async (faker, _, { password = '12345', role = 'applicant', applicationStatus = 'unhandled' } = {}) => {

  const roleId = role === 'recruiter' ? 1 : 2

  return {
    name: faker.first(),
    surname: faker.last(),
    ssn: `${date(faker.timestamp(), 'YYYYMMDD')}-${faker.integer({ min: 1000, max: 9999 })}`,
    email: faker.email(),
    password,
    role_id: roleId,
    username: faker.username(),
    application_date: date(faker.timestamp()),
    application_status: applicationStatus,
    application_reviewed_at: dateTime(faker.timestamp()),
  }
})
