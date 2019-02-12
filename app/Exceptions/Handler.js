'use strict'

const BaseExceptionHandler = use('BaseExceptionHandler')
const Logger = use('Logger')

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

    const isJSON = request.accepts(['html', 'json']) === 'json'
    Logger.error(error.stack)

    if (error.name === 'UserNotFoundException') {

      if (isJSON) {
        return response.status(401).send({ error: antl.formatMessage('authentication.errorUserNotFound') })
      }

      session.withErrors([{ field: error.uidField, message: antl.formatMessage('authentication.errorUserNotFound') }]).flashAll()
      await session.commit()

      return response.redirect('back')
    }

    if (error.name === 'PasswordMisMatchException') {

      if (isJSON) {
        return response.status(401).send({ error: antl.formatMessage('authentication.errorPasswordMismatch') })
      }

      session.withErrors([{ field: error.passwordField, message: antl.formatMessage('authentication.errorPasswordMismatch') }]).flashAll()
      await session.commit()

      return response.redirect('back')
    }

    if (error.name === 'InvalidSessionException') {

      session.put('from_url', request.url())
      session.commit()

      return response.redirect('/login')
    }

    if (is404Error(error)) {

      if (isJSON) {
        return response.status(404).send({ error: antl.formatMessage('errorpage.404Text') })
      }

      return response.status(404).send(view.render('errors.404'))
    }

    if (error.name === 'UnauthorizedException') {

      if (isJSON) {
        return response.status(401).send({ error: antl.formatMessage('errorpage.401Text') })
      }

      return response.status(401).send(view.render('errors.401'))
    }

    if (process.env.NODE_ENV === 'production') {
      if (isJSON) {
        return response.status(500).send({ error: antl.formatMessage('errorpage.500Text') })
      }

      return response.status(500).send(view.render('errors.500'))
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
