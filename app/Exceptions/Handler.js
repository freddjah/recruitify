'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')

function is404Error(error) {

  if (error.name === 'ModelNotFoundException') {
    return true
  }

  if (error.name === 'HttpException' && error.code === 'E_ROUTE_NOT_FOUND') {
    return true
  }

  return false
}

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
  async handle(error, { request, response, session, view, antl }) {

    if (error.name === 'InvalidSessionException') {

      session.put('from_url', request.url())
      session.commit()

      return response.redirect('/login')
    }

    if (is404Error(error)) {
      return response.status(404).send(view.render('errors.404'))
    }

    if (error.name === 'UnauthorizedException') {
      return response.status(401).send(view.render('errors.401'))
    }

    if (error.name === 'UserNotFoundException') {

      session.withErrors([{ field: error.uidField, message: antl.formatMessage('authentication.errorUserNotFound') }]).flashAll()
      await session.commit()

      return response.redirect('back')
    }

    if (error.name === 'PasswordMisMatchException') {

      session.withErrors([{ field: error.passwordField, message: antl.formatMessage('authentication.errorPasswordMismatch') }]).flashAll()
      await session.commit()

      return response.redirect('back')
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
