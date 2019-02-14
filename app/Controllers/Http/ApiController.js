'use strict'

const moment = require('moment')

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')
const RoleRepository = use('App/Repositories/RoleRepository')
const Role = use('App/Models/Role')
const createTransformers = use('App/transformers')
const saveApplication = use('App/Jobs/saveApplication')
const Logger = use('Logger')

/**
 * Controller to handle API
 */
class ApiController {

  /**
   * Fetches competences.
   * @param {Object} ctx
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.antl - Adonis antl
   * @returns {JSON} - Competences
   */
  async getCompetences({ response, antl }) {

    const { transformCompetence } = createTransformers(antl.currentLocale())
    Logger.debug('Fetching competences...')
    const competences = await CompetenceRepository.getAll()
    Logger.info(`${competences.rows.length} competences was fetched`)

    response.send({
      competences: competences.rows.map(transformCompetence),
    })
  }

  /**
   * Fetches competences.
   * @param {Object} ctx
   * @param {Object} ctx.response - Adonis response
   * @returns {JSON} - Statuses
   */
  async getStatuses({ response, antl }) {
    response.send({
      statuses: {
        unhandled: antl.formatMessage('recruiter.unhandled'),
        accepted: antl.formatMessage('recruiter.accepted'),
        rejected: antl.formatMessage('recruiter.rejected'),
      },
    })
  }

  /**
   * Handles login request
   * @param {Object} ctx
   * @param {Object} ctx.auth - Adonis auth
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @returns {JSON} - JWT token
   */
  async login({ request, response, auth }) {

    const { username, password } = request.post()

    const authJwt = auth.authenticator('jwt')
    Logger.debug('Validating login...', { username })
    const person = await authJwt.validate(username, password, true)
    const role = await person.role().fetch()
    const jwt = await authJwt.generate(person, { role: role.name })
    Logger.info('User successfully created token')

    return response.send(jwt)
  }

  /**
   * Handle register request, registers a new person
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @returns {JSON} - Message
   */
  async register({ request, response, antl }) {
    const { APPLICANT } = RoleRepository.getRoleNames()

    Logger.debug('Fetching role...', { role_name: APPLICANT })
    const role = await RoleRepository.getByName(APPLICANT)
    Logger.info('Successfully fetched role')

    Logger.debug('Creating new user...')
    await PersonRepository.create({ ...request.post(), roleId: role.role_id })
    Logger.info('Successfully created user')

    response.send({ message: antl.formatMessage('authentication.registerDoneApi') })
  }

  /**
   * Handle application form request. Creates new application
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.session - Adonis session
   * @param {Object} ctx.auth - Adonis auth
   * @param {Object} ctx.antl - Adonis antl
   * @returns {JSON} - Message
   */
  async saveApplication({ request, response, auth, antl }) {

    const person = await auth.getUser()
    Logger.debug('Saving application...')
    await saveApplication(person, request.post())
    Logger.info('Application was successfully created', { personId: person.person_id })

    return response.send({ message: antl.formatMessage('applicant.flashMessage') })
  }

  /**
   * Displays search result
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis antl
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.request - Adonis response
   * @returns {JSON} - Search result
   */
  async searchResults({ antl, request, response }) {

    const { transformPerson } = createTransformers(antl.currentLocale())
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

    return response.send({
      persons: persons.rows.map(transformPerson),
      paginator: persons.pages,
    })
  }

  /**
   * Display specific application
   * @param {Object} ctx
   * @param {Object} ctx.params - Adonis params
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.antl - Adonis antl
   * @returns {JSON} - Application
   */
  async view({ params, response, antl }) {

    const { transformAvailability, transformCompetenceProfile, transformPerson } = createTransformers(antl.currentLocale())

    Logger.debug('Fetching person and relations...', { personId: params.personId })
    const person = await PersonRepository.findById(params.personId)
    const role = await person.role().fetch()

    if (role.name === Role.RECRUITER_ROLE_NAME) {
      Logger.warning('Specified user is not an applicant, showing error to client', { personId: params.personId })
      return response.status(404).send({ error: antl.formatMessage('errorpage.404Text') })
    }

    const availabilities = await person.availabilities().fetch()
    const competenceProfiles = await person.competenceProfiles().with('competence').fetch()
    Logger.info(`Found person with ${availabilities.rows.length} availabilities and ${competenceProfiles.rows.length} competence profiles`)

    return response.send({
      person: transformPerson(person),
      availabilities: availabilities.rows.map(transformAvailability),
      competenceProfiles: competenceProfiles.rows.map(transformCompetenceProfile),
    })
  }

  /**
   * Update application status
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.params - Adonis params
   * @returns {JSON} - Application
   */
  async updateStatus({ request, response, params, antl }) {

    const form = request.post()
    Logger.debug('Fetching user...', { personId: params.personId })
    const person = await PersonRepository.findById(params.personId)
    const role = await person.role().fetch()

    if (role.name === Role.RECRUITER_ROLE_NAME) {
      Logger.warning('Specified user is not an applicant, showing error to client', { personId: params.personId })
      return response.status(404).send({ error: antl.formatMessage('errorpage.404Text') })
    }

    Logger.info('Found user')

    Logger.debug('Updating status...', { personId: params.personId })
    await PersonRepository.update(person, {
      application_status: form.applicationStatus,
      application_reviewed_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })
    Logger.info('Successfully updated status', { personId: params.personId })

    return response.send({ message: antl.formatMessage('recruiter.updateFlashMessage') })
  }
}

module.exports = ApiController
