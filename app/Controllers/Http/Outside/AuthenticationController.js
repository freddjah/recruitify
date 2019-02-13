'use strict'

const PersonRepository = use('App/Repositories/PersonRepository')
const RoleRepository = use('App/Repositories/RoleRepository')
const Logger = use('Logger')

/**
 * Controller to handle persons and authentication
 */
class AuthenticationController {

  /**
   * Renders register form
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   */
  registerForm({ view }) {
    return view.render('outside.authentication.register-form')
  }

  /**
   * Handle register form request, registers a new person
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   */
  async register({ request, response }) {
    const { APPLICANT } = RoleRepository.getRoleNames()

    Logger.debug('Fetching role...', { role_name: APPLICANT })
    const applicantRole = await RoleRepository.getByName(APPLICANT)
    Logger.info('Successfully fetched role')

    Logger.debug('Creating new user...')
    await PersonRepository.create({ ...request.all(), roleId: applicantRole.role_id })
    Logger.info('Successfully created user')

    return response.redirect('/register/done')
  }

  /**
   * Renders register confirmation
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   */
  registerDone({ view }) {
    return view.render('outside.authentication.register-done')
  }

  /**
   * Returns login form
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   * @returns {Object}
   */
  loginForm({ view }) {
    return view.render('outside.authentication.login-form')
  }

  /**
   * Handles login request
   * @param {Object} ctx
   * @param {Object} ctx.auth - Adonis auth
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.response - Adonis response
   * @param {Object} ctx.session - Adonis session
   * @returns {Object}
   */
  async login({ auth, request, response, session }) {

    const { username, password } = request.all()
    Logger.debug('Validating login...', { username })
    await auth.attempt(username, password)
    Logger.info('Successfully logged in user')

    const redirectUrl = session.pull('from_url', '/')
    return response.redirect(redirectUrl)
  }

  /**
   * Handles logout request
   * @param {Object} ctx
   * @param {Object} ctx.reponse - Adonis response
   * @param {Object} ctx.auth - Adonis auth
   * @returns {Object}
   */
  async logout({ response, auth }) {

    Logger.debug('Trying to logout user...')
    await auth.logout()
    Logger.info('Successfully logged out user')
    return response.redirect('/')
  }
}

module.exports = AuthenticationController
