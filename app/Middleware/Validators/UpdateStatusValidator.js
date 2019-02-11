'use strict'

const moment = require('moment')

const Validator = use('App/Middleware/Validators/Validator')
const PersonRepository = use('App/Repositories/PersonRepository')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Form validation when a recruiter is updating application status
*/
class UpdateStatusValidator extends Validator {

  /**
   * Validation rules
   * @returns {Object}
   */
  rules() {

    return {
      applicationStatus: 'required|in:accepted,rejected,unhandled',
    }
  }

  /**
   * Custom error messages
   * @returns {Object}
   */
  messages({ antl }) {

    return {
      'applicationStatus.required': antl.formatMessage('errors.required'),
      'applicationStatus.in': antl.formatMessage('errors.applicationStatusIn'),
      'applicationStatus.conflictingUpdates': antl.formatMessage('errors.applicationStatusConflictingUpdates'),
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
  async customValidation({ request, params: { personId } }) {

    const form = request.post()
    const person = await PersonRepository.findById(personId)
    const errors = []

    if (person.application_reviewed_at !== null) {

      const applicationReviewedAt = moment(person.application_reviewed_at, 'YYYY-MM-DD HH:mm:ss').unix()
      const reviewTime = moment(form.reviewTime, 'YYYY-MM-DD HH:mm:ss').unix()

      if (applicationReviewedAt > reviewTime) {
        errors.push(this.customError('applicationStatus', 'conflictingUpdates'))
      }
    }

    return errors
  }
}

module.exports = UpdateStatusValidator
