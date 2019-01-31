'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')

function validateSave(data) {

  const errors = {}

  // Validate expertises
  if (!data.expertise_competence_id || !data.expertise_years_of_experience || data.expertise_competence_id.length === 0 || data.expertise_years_of_experience.length === 0) {
    errors.expertises = 'Enter at least one expertise'
  }

  return errors
}

class ApplicationController {

  async applicationForm({ view }) {
    const competences = await CompetenceRepository.getAll()

    return view.render('inside.applicant.application.application-form', { competences })
  }

  saveApplication({ request, response, session }) {

    const errors = validateSave(request.all())
    console.log('errors', errors)

    if (Object.keys(errors).length > 0) {

      session.withErrors(errors).flashAll()
      return response.redirect('back')
    }

    // console.log(request.all())
    return response.send('Success')
  }
}

module.exports = ApplicationController
