'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Role extends Model {

  static get table() {
    return 'role'
  }

  static get primaryKey() {
    return 'role_id'
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

module.exports = Role
