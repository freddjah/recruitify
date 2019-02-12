'use strict'

/**
 * Repository for Availability
 * Handles functions for database requests
 */
class RoleRepository {

  /**
   * Fetches role from database
   * @param {String} role
   * @returns {Promise<availabilityModel>} - A promise that can be awaited which resolves to a Role object.
   */
  static getByName(roleName) {

    const Role = use('App/Models/Role')

    return Role.findByOrFail('name', roleName)
  }

  static getRoleNames() {

    const Role = use('App/Models/Role')

    return {
      APPLICANT: Role.APPLICANT_ROLE_NAME,
      RECRUITER: Role.RECRUITER_ROLE_NAME,
    }
  }
}

module.exports = RoleRepository
