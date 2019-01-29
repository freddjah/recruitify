'use strict'

class ApplicationController {

  applicationForm({ view }) {
    view.render('inside.applicant.application.application-form')
  }

  saveApplication({ response }) {
    response.send('Success')
  }
}

module.exports = ApplicationController
