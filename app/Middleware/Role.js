'use strict'

const UnauthorizedException = use('App/Exceptions/UnauthorizedException')
const Logger = use('Logger')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Role {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ auth }, next, [expectedRole]) {

    const person = await auth.getUser()

    Logger.debug('Fetching role of user with id and expected role...', { personId: person.person_id, expectedRole })
    const role = await person.role().fetch()
    Logger.info(`Succesfully got role ${role.name}`)

    if (role.name !== expectedRole) {
      throw new UnauthorizedException()
    }

    // call next to advance the request
    await next()
  }
}

module.exports = Role
