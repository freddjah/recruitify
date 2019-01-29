'use strict'

class AuthenticationController {

  registerForm({ view }) {
    view.render('outside.authentication.register-form')
  }

  register({ response }) {
    response.send('register')
  }

  registerDone({ view }) {
    view.render('outside.authentication.register-done')
  }

  loginForm({ view }) {
    view.render('outside.authentication.login-form')
  }

  login({ response }) {
    response.send('login')
  }
}

module.exports = AuthenticationController
