'use strict'

const { rule } = use('Validator')
const Validator = use('App/Middleware/Validators/Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Form validation when a recruiter is updating application status
*/
class RegisterPersonValidator extends Validator {

  /**
   * Validation rules
   * @returns {Object}
   */
  rules() {

    return {
      name: 'required',
      surname: 'required',
      email: 'required|email',
      ssn: [
        rule('required'),
        rule('regex', /^[0-9]{8}-[0-9]{4}$/),
      ],
      username: [
        rule('required'),
        rule('regex', /^[a-z0-9]+$/),
        rule('unique', 'person', 'username'),
      ],
      password: 'required|confirmed',
    }
  }

  /**
   * Custom error messages
   * @returns {Object}
   */
  messages({ antl }) {

    return {
      'name.required': antl.formatMessage('errors.required'),
      'surname.required': antl.formatMessage('errors.required'),
      'email.required': antl.formatMessage('errors.required'),
      'email.email': antl.formatMessage('errors.emailEmail'),
      'ssn.required': antl.formatMessage('errors.required'),
      'ssn.regex': antl.formatMessage('errors.ssnRegex'),
      'username.required': antl.formatMessage('errors.required'),
      'username.regex': antl.formatMessage('errors.usernameRegex'),
      'username.unique': antl.formatMessage('errors.usernameUnique'),
      'password.required': antl.formatMessage('errors.required'),
      'password.confirmed': antl.formatMessage('errors.passwordConfirmed'),
    }
  }
}

module.exports = RegisterPersonValidator
