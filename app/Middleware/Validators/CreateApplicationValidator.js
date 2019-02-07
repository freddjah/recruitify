'use strict'

const Validator = use('App/Middleware/Validators/Validator')
const CompetenceRepository = use('App/Repositories/CompetenceRepository')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Form validation when a recruiter is updating application status
*/
class CreateApplicationValidator extends Validator {

  /**
   * Custom error messages
   * @returns {Object}
   */
  messages() {

    return {
      'expertises.empty': 'Enter at least one expertise',
      'expertises.length': 'Invalid expertises',
      'expertises.years': 'Enter valid years of experience',
      'availabilities.empty': 'Enter at least one availability',
      'availabilities.length': 'Invalid availabilities',
      'availabilities.dates': 'From date must be earlier than to date',
    }
  }

  /**
   * Custom validation function for more advanced validation.
   * Makes sure that two recruiters can not edit the same application at the same time.
   * @param {Object} ctx
   * @param {Object} ctx.request - Adonis request
   * @param {Object} ctx.params - Adonis params
   * @param {number} ctx.params.personId - Person ID
   * @returns {array} - A list with validation errors
   */
  async customValidation({ request }) {

    const form = request.post()
    const errors = []

    if (!form.expertiseCompetenceId || !form.expertiseYearsOfExperience) {
      errors.push(this.customError('expertises', 'empty'))
    }

    if (!form.availabilityFrom || !form.availabilityTo) {
      errors.push(this.customError('availabilities', 'empty'))
    }

    if (errors.length > 0) {
      return errors
    }

    if (form.expertiseCompetenceId.length !== form.expertiseYearsOfExperience.length) {
      errors.push(this.customError('expertises', 'length'))
    }

    if (form.availabilityFrom.length !== form.availabilityTo.length) {
      errors.push(this.customError('availabilities', 'length'))
    }

    const competences = await CompetenceRepository.getCompetenceIds(form.expertiseCompetenceId)
    if (competences.rows.length !== form.expertiseCompetenceId.length) {
      errors.push(this.customError('expertises', 'length'))
    }

    const invalidYear = form.expertiseYearsOfExperience
      .map(value => parseInt(value, 10))
      .find(value => value < 1 || value > 99)

    if (invalidYear) {
      errors.push(this.customError('expertises', 'years'))
    }

    const invalidAvailability = form.availabilityFrom
      .map((value, index) => [
        new Date(value).getTime(),
        new Date(form.availabilityTo[index]).getTime(),
      ])
      .find(([from, to]) => from > to)

    if (invalidAvailability) {
      errors.push(this.customError('availabilities', 'dates'))
    }

    return errors
  }
}

module.exports = CreateApplicationValidator
