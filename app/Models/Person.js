'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Person extends Model {

  static get table() {
    return 'person'
  }

  static get primaryKey() {
    return 'person_id'
  }

  static boot() {
    super.boot()

    /**
     * A hook to hash the user password before saving
     * it to the database.
     */
    this.addHook('beforeSave', async userInstance => {
      if (userInstance.dirty.password) {
        userInstance.password = await Hash.make(userInstance.password) // eslint-disable-line
      }
    })
  }

  availabilites() {
    return this.hasMany('App/Models/Availability', 'person_id')
  }

  competenceProfiles() {
    return this.hasMany('App/Models/CompetenceProfile', 'person_id')
  }

  role() {
    return this.belongsTo('App/Models/Role', 'role_id')
  }

  /**
   * A relationship on tokens is required for auth to
   * work. Since features like `refreshTokens` or
   * `rememberToken` will be saved inside the
   * tokens table.
   *
   * @method tokens
   *
   * @return {Object}
   */
  /*
  tokens() {
    return this.hasMany('App/Models/Token')
  }
  */
}

module.exports = Person
