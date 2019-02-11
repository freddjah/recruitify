'use strict'

// const UnauthorizedException = use('App/Exceptions/UnauthorizedException')
const { validateAll } = use('Validator')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * A abstract validator class that must be extended
 */
class Validator {

  /**
   * @param {object} ctx
   * @param {Function} next
   */
  async handle(ctx, next) { // eslint-disable-line

    const { request, response, session } = ctx

    const withErrors = messages => {
      session.withErrors(messages).flashAll()
      return response.redirect('back')
    }

    if (typeof this.rules === 'function') {

      const validation = await validateAll(request.all(), this.rules(), this.messages(ctx))

      if (validation.fails()) {
        return withErrors(validation.messages())
      }
    }

    if (typeof this.customValidation === 'function') {

      const errors = await this.customValidation(ctx)
      if (errors.length > 0) {

        const messages = this.messages()
        return withErrors(errors.map(({ field, validation }) => ({ field, validation, message: messages[`${field}.${validation}`] })))
      }
    }

    // call next to advance the request
    await next()
  }

  /**
   * Helper function to create a custom error object
   * @param {string} field - Name of the input
   * @param {string} validation - Validation that failed
   * @returns {object} - Custom validation error object
   */
  customError(field, validation) {
    return { field, validation }
  }
}

module.exports = Validator
