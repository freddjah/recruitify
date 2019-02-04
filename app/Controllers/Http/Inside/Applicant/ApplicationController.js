'use strict'

const CompetenceRepository = use('App/Repositories/CompetenceRepository')
const AvailabilityRepository = use('App/Repositories/AvailabilityRepository')
const CompetenceProfileRepository = use('App/Repositories/CompetenceProfileRepository')


function validateRequiredFields({
  expertiseCompetenceId,
  expertiseYearsOfExperience,
  availabilityFrom,
  availabilityTo,
}) {

  const errors = {}

  if (!expertiseCompetenceId.length === 0 || expertiseYearsOfExperience.length === 0) {
    errors.expertises = 'Enter at least one expertise'
  }

  if (!availabilityFrom.length === 0 || availabilityTo.length === 0) {
    errors.availabilities = 'Enter availability dates'
  }

  if (expertiseCompetenceId.length !== expertiseYearsOfExperience.length) {
    errors.expertises = 'Invalid expertises'
  }

  if (availabilityFrom.length !== availabilityTo.length) {
    errors.availabilities = 'Invalid availabilities'
  }

  return errors
}

async function validateSave({
  expertise_competence_id: expertiseCompetenceId = [],
  expertise_years_of_experience: expertiseYearsOfExperience = [],
  availability_from: availabilityFrom = [],
  availability_to: availabilityTo = [],
}) {

  const errors = validateRequiredFields({
    expertiseCompetenceId,
    expertiseYearsOfExperience,
    availabilityFrom,
    availabilityTo,
  })

  if (Object.keys(errors).length > 0) {
    return errors
  }

  const competences = await CompetenceRepository.getCompetenceIds(expertiseCompetenceId)

  if (competences.rows.length !== expertiseCompetenceId.length) {
    errors.expertises = 'Invalid expertise'
  }

  const invalidYear = expertiseYearsOfExperience
    .map(value => parseInt(value, 10))
    .find(value => value < 1 || value > 99)

  if (invalidYear) {
    errors.expertises = 'Enter valid years of experience'
  }

  const invalidAvailability = availabilityFrom
    .map((value, index) => [
      new Date(value).getTime(),
      new Date(availabilityTo[index]).getTime(),
    ])
    .find(([from, to]) => from > to)

  if (invalidAvailability) {
    errors.availabilities = 'From date must be earlier than to date'
  }

  return errors
}

class ApplicationController {

  async applicationForm({ view }) {
    const competences = await CompetenceRepository.getAll()

    return view.render('inside.applicant.application.application-form', { competences })
  }

  async saveApplication({ request, response, session, auth }) {

    const errors = await validateSave(request.all())
    console.log('errors', errors)

    if (Object.keys(errors).length > 0) {

      session.withErrors(errors).flashAll()
      return response.redirect('back')
    }
    const person = await auth.getUser()

    await AvailabilityRepository.deleteByPersonId(person.person_id)
    await CompetenceProfileRepository.deleteByPersonId(person.person_id)

    const data = request.all()

    for (const index in data.expertiseCompetenceId) {

      await CompetenceProfileRepository.create({
        personId: person.person_id,
        competenceId: data.expertise_competence_id[index],
        yearsOfExperience: data.expertise_years_of_experience[index],
      })
    }

    for (const index in data.availability_from) {

      await AvailabilityRepository.create({
        personId: person.person_id,
        fromDate: data.availability_from[index],
        toDate: data.availability_to[index],
      })
    }
    session.flash({ confirmation: 'You have successfully applied. Do not call us. We will call you' })
    return response.redirect('back')
  }
}

module.exports = ApplicationController
