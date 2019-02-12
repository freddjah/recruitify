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
  static create({ personId, competenceId, yearsOfExperience }, trx) {

    const CompetenceProfile = use('App/Models/CompetenceProfile')

    return CompetenceProfile.create({
      person_id: personId,
      competence_id: competenceId,
      years_of_experience: yearsOfExperience,
    }, trx)
  }

  /**
   * Deletes competence profile by person id
   * @param {number} personId
   * @returns {Promise<void>} - A promise that can be awaited.
   */
  static deleteByPersonId(personId, trx) {

    const CompetenceProfile = use('App/Models/CompetenceProfile')
    return CompetenceProfile.query().transacting(trx).where('person_id', personId).delete()
  }
}

module.exports = CompetenceProfileRepository
