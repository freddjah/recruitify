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
}

module.exports = CompetenceRepository
