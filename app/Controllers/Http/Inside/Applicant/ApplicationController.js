'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const saveApplication = use('App/Jobs/saveApplication')
const Logger = use('Logger')

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
    Logger.debug('Fetching competences...')
    const competences = await CompetenceRepository.getAll()
    Logger.info(`${competences.rows.length} competences was fetched`)
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
  async saveApplication(ctx) {

    const { request, response, session, auth, antl } = ctx

    const person = await auth.getUser()
    Logger.debug('Saving application...')
    await saveApplication(person, request.post())
    Logger.info('Application was successfully created', { personId: person.person_id })

    session.flash({ confirmation: antl.formatMessage('applicant.flashMessage') })
    return response.redirect('back')
  }
}

module.exports = ApplicationController
