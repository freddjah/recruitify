'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')

/**
 * Builds query string
 * @param {Object} params
 * @returns {String}
 */
function buildQuerystring(params) {
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
}

/**
 * Controller for handling applications for recruiter
 */
class ApplicationController {

  /**
   * Redirects user to /recruiter/application
   * @param {Object} ctx
   * @param {Object} ctx.response - Adonis response
   */
  index({ response }) {
    return response.redirect('/recruiter/applications')
  }

  /**
   * Displays search form
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   */
  async searchForm({ view }) {
    const competences = await CompetenceRepository.getAll()
    return view.render('inside.recruiter.application.search-form', { competences })
  }

  /**
   * Displays search result
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   * @param {Object} ctx.request - Adonis request
   */
  async searchResults({ view, request }) {

    const persons = await PersonRepository.getPersonBySearchQuery(request.get())
    const query = buildQuerystring(request.get())

    return view.render('inside.recruiter.application.search-results', { persons, query })
  }

  /**
   * Display specific application
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   * @param {Object} ctx.request - Adonis request
   * @param {Object} params
   */
  async view({ view, params, request }) {

    const person = await PersonRepository.findById(params.personId)
    const availabilities = await person.availabilities().fetch()
    const competenceProfiles = await person.competenceProfiles().with('competence').fetch()
    const query = buildQuerystring(request.get())

    return view.render('inside.recruiter.application.view', { person, availabilities, competenceProfiles, query })
  }
}

module.exports = ApplicationController
