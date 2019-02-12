'use strict'

const moment = require('moment')

const Database = use('Database')
const AvailabilityRepository = use('App/Repositories/AvailabilityRepository')
const CompetenceProfileRepository = use('App/Repositories/CompetenceProfileRepository')
const PersonRepository = use('App/Repositories/PersonRepository')
const Logger = use('Logger')

async function saveApplication(person, data) {

  const trx = await Database.beginTransaction()

  Logger.debug('Updating person...', { personId: person.person_id })
  await PersonRepository.update(person, {
    application_date: moment().format('YYYY-MM-DD'),
    application_status: 'unhandled',
    application_reviewed_at: null,
  }, trx)
  Logger.info('Successfully updated person')

  Logger.debug('Deleting availabilities connected to person...', { personId: person.person_id })
  await AvailabilityRepository.deleteByPersonId(person.person_id, trx)
  Logger.info('Succesfully deleted availabilities')

  Logger.debug('Deleting competence profiles connected to person...', { personId: person.person_id })
  await CompetenceProfileRepository.deleteByPersonId(person.person_id, trx)
  Logger.info('Succesfully deleted competence profiles')

  for (const index in data.expertiseCompetenceId) {

    Logger.debug('Creating competence profile connected to person...', { personId: person.person_id })
    await CompetenceProfileRepository.create({
      personId: person.person_id,
      competenceId: data.expertiseCompetenceId[index],
      yearsOfExperience: data.expertiseYearsOfExperience[index],
    }, trx)
    Logger.info('Succesfully created competence profile')
  }

  for (const index in data.availabilityFrom) {

    Logger.debug('Creating availability connected to person...', { personId: person.person_id })
    await AvailabilityRepository.create({
      personId: person.person_id,
      fromDate: data.availabilityFrom[index],
      toDate: data.availabilityTo[index],
    }, trx)
    Logger.info('Succesfully created availability')
  }

  trx.commit()
}

module.exports = saveApplication
