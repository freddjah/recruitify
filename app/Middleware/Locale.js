'use strict'


/**
 * A middleware that sets the locale based on the locale param in url
 */
class Locale {
  /**
   * @param {object} ctx
   * @param {object} ctx.antl - Adonis Antl
   * @param {object} ctx.request - Adonis request
   * @param {object} ctx.session - Adonis session
   * @param {object} ctx.session - Adonis response
   * @param {Function} next
   */
  async handle({ antl, request, session, response, view }, next) { // eslint-disable-line
    const { locale: chosenLocale } = request.get()

    if (chosenLocale) {
      session.put('locale', chosenLocale)
      return response.redirect('back')
    }

    const locale = session.get('locale', antl.currentLocale())
    antl.switchLocale(locale)

    const currentLocale = locale.replace('-', '_')
    view.share({ currentLocale })

    await next()
  }
}

module.exports = Locale
