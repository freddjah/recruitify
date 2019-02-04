'use strict'

/**
 * Repository for Competence
 * Handles functions for database requests
 */
class CompetenceRepository {

  static getAll() {
    const Competence = use('App/Models/Competence')
    return Competence.all()
  }

  static getCompetenceIds(ids) {
    const Competence = use('App/Models/Competence')
    return Competence.query().whereIn('competence_id', ids).fetch()
  }
}

module.exports = CompetenceRepository
