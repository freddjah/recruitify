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
  async home({ auth, response }) {

    const person = await auth.getUser()
    const role = await person.role().fetch()

    return response.redirect(`/${role.name}`)
  }
}

module.exports = HomeController
