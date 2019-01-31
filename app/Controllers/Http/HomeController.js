'use strict'

/**
 * Controller to handle home page
 */
class HomeController {

  /**
   * Renders register form
   * @param {Object} ctx
   * @param {Object} ctx.view - Adonis view
   */
  home({ view }) {
    return view.render('inside.home')
  }
}

module.exports = HomeController
