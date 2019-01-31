'use strict'

/**
 * Repository for Person
 * Handles functions for database requests
 */
class PersonRepository {

  /**
   * Creates a new person in database
   * @param {Object} personData
   * @param {string} personData.name
   * @param {string} personData.surname
   * @param {string} personData.email
   * @param {string} personData.ssn
   * @param {string} personData.username
   * @param {string} personData.password
   * @param {number} personData.roleId
   * @returns {Promise<PersonModel>} - A promise that can be awaited which resolves to a Person object.
   */
  static create({ name, surname, email, ssn, username, password, roleId }) {

    const Person = use('App/Models/Person')

    return Person.create({
      name,
      surname,
      email,
      ssn,
      username,
      password,
      role_id: roleId,
    })
  }
}

module.exports = PersonRepository