'use strict'

/**
 * Repository for competence profile
 * Handles functions for database requests
 */
class CompetenceProfileRepository {

  /**
   * Creates a new competence in database
   * @param {Object} competenceData
   * @param {string} competenceData.personId
   * @param {string} competenceData.competenceId
   * @param {string} competenceData.yearsOfExperience
   * @returns {Promise<CompetenceProfileModel>} - A promise that can be awaited which resolves to a CompetenceProfile object.
   */
  static create({ personId, competenceId, yearsOfExperience }) {

    const CompetenceProfile = use('App/Models/CompetenceProfile')

    return CompetenceProfile.create({
      person_id: personId,
      competence_id: competenceId,
      years_of_experience: yearsOfExperience,
    })
  }

  static deleteByPersonId(personId) {

    const CompetenceProfile = use('App/Models/CompetenceProfile')
    return CompetenceProfile.query().where('person_id', personId).delete()
  }

  static getByCompetenceId(competenceId) {
    const CompetenceProfile = use('App/Models/CompetenceProfile')
    return CompetenceProfile.query().where('competence_id', competenceId).fetch()
  }
}

module.exports = CompetenceProfileRepository
