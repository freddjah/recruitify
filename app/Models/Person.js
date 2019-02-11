'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
 * Database model for person
 */
class Person extends Model {

  /**
   * Database table
   * @returns {string}
  */
  static get table() {
    return 'person'
  }

  /**
   * Database primary key column
   * @returns {string}
  */
  static get primaryKey() {
    return 'person_id'
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

  /**
   * Hides fields
   */
  static get hidden() {
    return ['password']
  }

  /**
   * Database model boot
  */
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

  /**
   * Database model relation for availabilities
   * @returns {object}
  */
  availabilities() {
    return this.hasMany('App/Models/Availability', 'person_id')
  }

  /**
   * Database model relation for competence profiles
   * @returns {object}
  */
  competenceProfiles() {
    return this.hasMany('App/Models/CompetenceProfile', 'person_id')
  }

  /**
   * Database table relation for role
   * @returns {object}
  */
  role() {
    return this.belongsTo('App/Models/Role', 'role_id')
  }
}

module.exports = Person
