'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')

class ApplicationController {

  index({ response }) {
    return response.redirect('/recruiter/applications')
  }

  async searchForm({ view }) {
    const competences = await CompetenceRepository.getAll()
    return view.render('inside.recruiter.application.search-form', { competences })
  }

  async searchResults({ view, request }) {

    const persons = await PersonRepository.getPersonBySearchQuery(request.get())

    return view.render('inside.recruiter.application.search-results', { persons })
  }

  async view({ view, params }) {

    const person = await PersonRepository.findById(params.personId)
    const availabilities = await person.availabilities().fetch()
    const competenceProfiles = await person.competenceProfiles().with('competence').fetch()

    return view.render('inside.recruiter.application.view', { person, availabilities, competenceProfiles })
  }
}

module.exports = ApplicationController
