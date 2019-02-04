'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const AvailabilityRepository = use('App/Repositories/AvailabilityRepository')
const CompetenceProfileRepository = use('App/Repositories/CompetenceProfileRepository')
const PersonRepository = use('App/Repositories/PersonRepository')

function intersect(array1, array2) {

  if (array1 === undefined && array2 === undefined) {
    return undefined
  }

  if (array1 === undefined) {
    return array2
  }

  if (array2 === undefined) {
    return array1
  }

  return array1.filter(val => array2.includes(val))
}

async function buildSearchResult({ from, to, competence, name, date }) {

  let availabilityPersonIds
  let competenceProfilePersonIds

  if (from || to) {

    const availabilites = await AvailabilityRepository.getAvailabilitiesByDate(from, to)
    availabilityPersonIds = availabilites.rows.map(({ person_id: personId }) => personId)

    if (availabilityPersonIds.length === 0) {
      return []
    }
  }

  if (competence) {

    const competenceProfiles = await CompetenceProfileRepository.getByCompetenceId(competence)
    competenceProfilePersonIds = competenceProfiles.rows.map(({ person_id: personId }) => personId)

    if (competenceProfilePersonIds.length === 0) {
      return []
    }
  }

  const personIds = intersect(availabilityPersonIds, competenceProfilePersonIds)
  return PersonRepository.getByFilter(name, personIds)
}

class ApplicationController {

  index({ response }) {
    return response.redirect('/recruiter/applications')
  }

  async searchForm({ view }) {
    const competences = await CompetenceRepository.getAll()
    return view.render('inside.recruiter.application.search-form', { competences })
  }

  async searchResults({ view, request, session, response }) {

    const persons = await buildSearchResult(request.get())
    return view.render('inside.recruiter.application.search-results', { persons })
  }

  viewApplication({ view }) {
    return view.render('inside.recruiter.application.view-application')
  }
}

module.exports = ApplicationController
