'use strict'

const { rule } = use('Validator')

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
      'email.email': 'Enter valid email',
      'ssn.regex': 'Enter a correct social security number',
      'username.regex': 'Use a-z and 0-9 for your username',
      'username.unique': 'There is already a user registered with that username',
      'password.confirmed': 'Passwords did not match',
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
