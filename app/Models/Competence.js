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
}

module.exports = Competence
