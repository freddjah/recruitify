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
}

module.exports = Role
