'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

/**
 * This class handles all exceptions thrown during
 * the HTTP request lifecycle.
 *
 * @class ExceptionHandler
 */
class ExceptionHandler extends BaseExceptionHandler {
  /**
   * Handle exception thrown during the HTTP lifecycle
   *
   * @method handle
   *
   * @param  {Object} error
   * @param  {Object} options.request
   * @param  {Object} options.response
   *
   * @return {void}
   */
  async handle(error, { request, response, session }) {

    if (error.name === 'InvalidSessionException') {

      session.put('from_url', request.url())
      session.commit()

      return response.redirect('/login')
    }

    return super.handle(...arguments) // eslint-disable-line prefer-rest-params
  }

  /**
   * Report exception for logging or debugging.
   *
   * @method report
   *
   * @param  {Object} error
   * @param  {Object} options.request
   *
   * @return {void}
   */
  async report(error, { request }) {
    return super.report(...arguments) // eslint-disable-line prefer-rest-params
  }
}

module.exports = ExceptionHandler