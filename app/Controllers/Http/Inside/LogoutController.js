'use strict'

class LogoutController {

  logout({ response }) {
    response.send('Success')
  }
}

module.exports = LogoutController
