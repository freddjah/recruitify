'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CompetenceProfile extends Model {

  static get table() {
    return 'competence_profile'
  }

  static get primaryKey() {
    return 'competence_profile_id'
  }

  person() {
    return this.belongsTo('App/Models/Person', 'person_id')
  }

  competence() {
    return this.belongsTo('App/Models/Competence', 'competence_id')
  }
}

module.exports = CompetenceProfile
