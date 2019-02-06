'use strict'

/**
 * Repository for Competence
 * Handles functions for database requests
 */
class CompetenceRepository {

  /**
   * Get list of all competences
   * @returns {Promise<Object>} - A promise that can be awaited and resolves into all competences
   */
  static getAll() {
    const Competence = use('App/Models/Competence')
    return Competence.all()
  }

  /**
   * Get list of competences by competence ids
   * @param {number} ids
   * @returns {Promise<Object>} - A promise that can be awaited and resolves into a list of competences
   */
  static getCompetenceIds(ids) {
    const Competence = use('App/Models/Competence')
    return Competence.query().whereIn('competence_id', ids).fetch()
  }
}

module.exports = CompetenceRepository
