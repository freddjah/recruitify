'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Availability extends Model {

  static get table() {
    return 'availability'
  }

  static get primaryKey() {
    return 'availability_id'
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


  person() {
    return this.belongsTo('App/Models/Person', 'person_id')
  }
}

module.exports = Availability
