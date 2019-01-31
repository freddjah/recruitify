'use strict'

const PersonRepository = use('App/Repositories/PersonRepository')

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

    await PersonRepository.create({ ...request.all(), roleId: 1 })
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

  loginForm({ view }) {
    return view.render('outside.authentication.login-form')
  }

  login({ response }) {
    return response.send('login')
  }
}

module.exports = AuthenticationController
