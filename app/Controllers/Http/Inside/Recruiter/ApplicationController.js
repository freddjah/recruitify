'use strict'

const moment = require('moment')

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')
const Role = use('App/Models/Role')
const RoleRepository = use('App/Repositories/RoleRepository')
const Logger = use('Logger')

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
    Logger.debug('Fetching competences...')
    const competences = await CompetenceRepository.getAll()
    Logger.info(`${competences.rows.length} competences was fetched`)
    return view.render('inside.recruiter.application.search-form', { competences })
  }

  /**
   * Displays search result
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   * @param {Object} ctx.request - Adonis request
   */
  async searchResults({ view, request }) {

    const { APPLICANT } = RoleRepository.getRoleNames()

    Logger.debug('Fetching role...', { role_name: APPLICANT })
    const role = await RoleRepository.getByName(APPLICANT)
    Logger.info('Successfully fetched role')

    const params = request.get()
    Logger.debug('Searching for applications...', params)
    const searchQuery = PersonRepository.buildPersonsBySearchQuery({ ...params, roleId: role.role_id })
    const currentPage = params.page
    const persons = await searchQuery.paginate(currentPage, 10)
    Logger.info(`Search query resulted in ${persons.rows.length} persons`)

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
  async view({ view, params, request, response }) {

    Logger.debug('Fetching person and relations...', { personId: params.person_id })
    const person = await PersonRepository.findById(params.personId)
    const role = await person.role().fetch()

    if (role.name === Role.RECRUITER_ROLE_NAME) {
      Logger.warning('Specified user is not an applicant, showing error to client', { personId: params.personId })
      return response.status(404).send(view.render('errors.404'))
    }

    const availabilities = await person.availabilities().fetch()
    const competenceProfiles = await person.competenceProfiles().with('competence').fetch()
    Logger.info(`Found person with ${availabilities.rows.length} availabilities and ${competenceProfiles.rows.length} competence profiles`)
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
  async updateStatus({ request, response, params, session, antl, view }) {

    const form = request.post()
    Logger.debug('Fetching user...', { personId: params.person_id })
    const person = await PersonRepository.findById(params.personId)
    const role = await person.role().fetch()

    if (role.name === Role.RECRUITER_ROLE_NAME) {
      Logger.warning('Specified user is not an applicant, showing error to client', { personId: params.personId })
      return response.status(404).send(view.render('errors.404'))
    }
    Logger.info('Found user')

    Logger.debug('Updating status...', { personId: params.person_id })
    await PersonRepository.update(person, {
      application_status: form.applicationStatus,
      application_reviewed_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })
    Logger.info('Successfully updated status', { personId: params.person_id })

    session.flash({ success: antl.formatMessage('recruiter.updateFlashMessage') })

    return response.redirect('back')
  }
}

module.exports = ApplicationController
