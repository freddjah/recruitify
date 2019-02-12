'use strict'

const moment = require('moment')

const Database = use('Database')
const AvailabilityRepository = use('App/Repositories/AvailabilityRepository')
const CompetenceProfileRepository = use('App/Repositories/CompetenceProfileRepository')
const PersonRepository = use('App/Repositories/PersonRepository')

async function saveApplication(person, data) {

  const trx = await Database.beginTransaction()

  await PersonRepository.update(person, {
    application_date: moment().format('YYYY-MM-DD'),
    application_status: 'unhandled',
    application_reviewed_at: null,
  }, trx)

  await AvailabilityRepository.deleteByPersonId(person.person_id, trx)
  await CompetenceProfileRepository.deleteByPersonId(person.person_id, trx)

  for (const index in data.expertiseCompetenceId) {

    await CompetenceProfileRepository.create({
      personId: person.person_id,
      competenceId: data.expertiseCompetenceId[index],
      yearsOfExperience: data.expertiseYearsOfExperience[index],
    }, trx)
  }

  for (const index in data.availabilityFrom) {

    await AvailabilityRepository.create({
      personId: person.person_id,
      fromDate: data.availabilityFrom[index],
      toDate: data.availabilityTo[index],
    }, trx)
  }

  trx.commit()
}

module.exports = saveApplication
