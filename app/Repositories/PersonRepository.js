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

  /**
   * Get list of persons by search query params
   * @param {Object} searchQuery
   * @param {Date} searchQuery.from - From date
   * @param {Date} searchQuery.to - To date
   * @param {Number} searchQuery.competence - Competence id
   * @param {String} searchQuery.name - Name
   * @param {Date} searchQuery.date - Application date
   * @returns {Promise<PersonModel[]>} - A promise that can be awaited and resolves into a list of persons
   */
  static buildPersonsBySearchQuery({ from, to, competence, name, date, roleId }) {
    const Person = use('App/Models/Person')

    const query = Person.query()

    if (roleId) {
      query
        .where('role_id', roleId)
    }

    if (from || to) {
      query
        .innerJoin('availability', 'person.person_id', 'availability.person_id')
        .clone()
    }

    if (from) {
      query
        .where('from_date', '<=', from)
        .where('to_date', '>=', from)
        .clone()
    }

    if (to) {
      query
        .where('to_date', '>=', to)
        .where('from_date', '<=', to)
        .clone()
    }

    if (competence) {
      query
        .innerJoin('competence_profile', 'person.person_id', 'competence_profile.person_id')
        .where('competence_id', competence)
        .clone()
    }

    if (name) {
      query
        .whereRaw("CONCAT(name, ' ', surname) LIKE ?", [`%${name}%`])
        .clone()
    }

    if (date) {
      query
        .where('application_date', date)
        .clone()
    }

    return query.select('person.*').clone()
  }

  static findById(id) {
    const Person = use('App/Models/Person')

    return Person.findOrFail(id)
  }

  static async update(person, data) {
    person.merge(data)
    await person.save()
    return person
  }
}

module.exports = PersonRepository
