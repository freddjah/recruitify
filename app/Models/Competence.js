'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Competence extends Model {

  static get table() {
    return 'competence'
  }

  static get primaryKey() {
    return 'competence_id'
  }

  /**
   * Database created at column
   * @returns {null}
  */
  static get createdAtColumn() {
    return null
  }

  /**
   * Database updated at column
   * @returns {null}
  */
  static get updatedAtColumn() {
    return null
  }

}

module.exports = Competence
