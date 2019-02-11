'use strict'

const moment = require('moment')

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const PersonRepository = use('App/Repositories/PersonRepository')
const AvailabilityRepository = use('App/Repositories/AvailabilityRepository')
const CompetenceProfileRepository = use('App/Repositories/CompetenceProfileRepository')

/**
 * Controller to handle home page
 */
class ApiController {

  /**
   * Renders register form
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   */
  async getCompetences({ response }) {
    const competences = await CompetenceRepository.getAll()

    response.send({ competences })
  }

  async getStatuses({ response }) {
    response.send({
      statuses: {
        unhandled: 'Unhandled',
        approved: 'Approved',
        rejected: 'Rejected',
      },
    })
  }

  async login({ request, response, auth }) {
    const { username, password } = request.post()

    const authJwt = auth.authenticator('jwt')
    const person = await authJwt.validate(username, password, true)
    const role = await person.role().fetch()
    const jwt = await authJwt.generate(person, { role: role.name })

    return response.send(jwt)
  }

  async register({ request, response }) {
    const person = await PersonRepository.create({ ...request.post(), roleId: 2 })
    response.send({ person })
  }

  async saveApplication({ request, response, auth }) {
    const person = await auth.getUser()

    await PersonRepository.update(person, {
      application_date: moment().format('YYYY-MM-DD'),
      application_status: 'unhandled',
      application_reviewed_at: null,
    })

    await AvailabilityRepository.deleteByPersonId(person.person_id)
    await CompetenceProfileRepository.deleteByPersonId(person.person_id)

    const form = request.post()

    for (const index in form.expertiseCompetenceId) {

      await CompetenceProfileRepository.create({
        personId: person.person_id,
        competenceId: form.expertiseCompetenceId[index],
        yearsOfExperience: form.expertiseYearsOfExperience[index],
      })
    }

    for (const index in form.availabilityFrom) {

      await AvailabilityRepository.create({
        personId: person.person_id,
        fromDate: form.availabilityFrom[index],
        toDate: form.availabilityTo[index],
      })
    }

    return response.send({ message: 'Great success!' })
  }

  async searchResults({ request, response }) {
    const params = request.get()
    const searchQuery = PersonRepository.buildPersonsBySearchQuery({ ...params, roleId: 2 })
    const currentPage = params.page
    const persons = await searchQuery.paginate(currentPage, 10)

    return response.send({ persons })
  }

  /**
   * Display specific application
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   * @param {Object} ctx.request - Adonis request
   * @param {Object} params
   */
  async view({ params, response }) {

    const person = await PersonRepository.findById(params.personId)
    const availabilities = await person.availabilities().setHidden(['availability_id', 'person_id']).fetch()
    const competenceProfiles = await person.competenceProfiles().with('competence').fetch()
    const reviewTime = moment().format('YYYY-MM-DD HH:mm:ss')

    return response.send({ person, availabilities, competenceProfiles, reviewTime })
  }

  /**
   * Display specific application
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   * @param {Object} ctx.request - Adonis request
   * @param {Object} params
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
