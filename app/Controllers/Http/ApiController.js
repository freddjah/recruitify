'use strict'

const moment = require('moment')

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')
const createTransformers = use('App/transformers')
const saveApplication = use('App/Jobs/saveApplication')

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
    const competences = await CompetenceRepository.getAll()

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
  async getStatuses({ response }) {
    response.send({
      statuses: {
        unhandled: 'Unhandled',
        approved: 'Approved',
        rejected: 'Rejected',
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
    const person = await authJwt.validate(username, password, true)
    const role = await person.role().fetch()
    const jwt = await authJwt.generate(person, { role: role.name })

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

    await PersonRepository.create({ ...request.post(), roleId: 2 })

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
    await saveApplication(person, request.post())

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

    const params = request.get()
    const searchQuery = PersonRepository.buildPersonsBySearchQuery({ ...params, roleId: 2 })
    const currentPage = params.page
    const persons = await searchQuery.paginate(currentPage, 10)

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

    const person = await PersonRepository.findById(params.personId)
    const availabilities = await person.availabilities().fetch()
    const competenceProfiles = await person.competenceProfiles().with('competence').fetch()

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
  async updateStatus({ request, response, params }) {

    const form = request.post()
    const person = await PersonRepository.findById(params.personId)

    await PersonRepository.update(person, {
      application_status: form.applicationStatus,
      application_reviewed_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    })

    return response.send({ message: 'Success' })
  }
}

module.exports = ApiController
