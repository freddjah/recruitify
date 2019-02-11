'use strict'

const moment = require('moment')

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const AvailabilityRepository = use('App/Repositories/AvailabilityRepository')
const CompetenceProfileRepository = use('App/Repositories/CompetenceProfileRepository')
const PersonRepository = use('App/Repositories/PersonRepository')

/**
 * Controller for handling applications for applicant
 */
class ApplicationController {

  /**
   * Redirects user to /applicant/application
   * @param {Object} ctx
   * @param {Object} ctx.response - Adonis response
   */
  index({ response }) {
    return response.redirect('/applicant/application')
  }

  /**
   * Displays application form
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   */
  async applicationForm({ view }) {
    const competences = await CompetenceRepository.getAll()
    return view.render('inside.applicant.application.application-form', { competences })
  }

  /**
   * Handle application form request. Creates new application
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.session - Adonis session
   * @param {Object} ctx.auth - Adonis auth
   */
  async saveApplication({ request, response, session, auth, antl }) {

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
    session.flash({ confirmation: antl.formatMessage('applicant.flashMessage') })
    return response.redirect('back')
  }
}

module.exports = ApplicationController
