'use strict'

const { rule } = use('Validator')
const Antl = use('Antl')

/**
 * Validating registration input fields
 */
class RegisterPerson {

  /**
   * Validation rules
   * @returns {Object}
   */
  get rules() {
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
  get messages() {

    return {
      'name.required': Antl.formatMessage('errors.required'),
      'surname.required': Antl.formatMessage('errors.required'),
      'email.required': Antl.formatMessage('errors.required'),
      'email.email': Antl.formatMessage('errors.emailEmail'),
      'ssn.required': Antl.formatMessage('errors.required'),
      'ssn.regex': Antl.formatMessage('errors.ssnRegex'),
      'username.required': Antl.formatMessage('errors.required'),
      'username.regex': Antl.formatMessage('errors.usernameRegex'),
      'username.unique': Antl.formatMessage('errors.usernameUnique'),
      'password.required': Antl.formatMessage('errors.required'),
      'password.confirmed': Antl.formatMessage('errors.passwordConfirmed'),
    }
  }

  /**
   * Validating all input fields
   * @returns {boolean}
   */
  get validateAll() {
    return true
  }
}

module.exports = RegisterPerson
