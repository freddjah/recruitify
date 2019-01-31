'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')

class ApplicationController {

  async applicationForm({ view }) {
    const competences = await CompetenceRepository.getAll()

    return view.render('inside.applicant.application.application-form', { competences })
  }

  saveApplication({ request, response }) {
    console.log(request.all())
    return response.send('Success')
  }
}

module.exports = ApplicationController
