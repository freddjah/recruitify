'use strict'

class ApplicationController {

  searchForm({ view }) {
    view.render('inside.recruiter.application.search-form')
  }

  searchResults({ view }) {
    view.render('inside.recruiter.application.search-results')
  }

  viewApplication({ view }) {
    view.render('inside.recruiter.application.view-application')
  }
}

module.exports = ApplicationController
