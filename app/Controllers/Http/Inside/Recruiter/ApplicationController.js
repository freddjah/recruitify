'use strict'

const moment = require('moment')

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')

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

    const params = request.get()
    const searchQuery = PersonRepository.buildPersonsBySearchQuery({ ...params, roleId: 2 })
    const currentPage = params.page
    const persons = await searchQuery.paginate(currentPage, 10)
    const query = request.get()

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
    const query = request.get()
    const reviewTime = moment().format('YYYY-MM-DD HH:mm:ss')

    return view.render('inside.recruiter.application.view', { person, availabilities, competenceProfiles, query, reviewTime })
  }

  /**
   * Updates status of application
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.params - Adonis params
   * @param {Object} ctx.session - Adonis session
   * @param {Object} ctx.antl - Adonis antl
   */
  async updateStatus({ request, response, params, session, antl }) {

    const form = request.post()
    const person = await PersonRepository.findById(params.personId)

    await PersonRepository.update(person, {
      application_status: form.applicationStatus,
      application_reviewed_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })

    session.flash({ success: antl.formatMessage('recruiter.updateFlashMessage') })

    return response.redirect('back')
  }
}

module.exports = ApplicationController
