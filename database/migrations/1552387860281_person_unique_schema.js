'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonUniqueSchema extends Schema {
  up() {

    this.table('person', table => {
      table.unique('username', 'person_username_unique')
    })
  }

  down() {

    this.table('person', table => {
      table.dropUnique('username', 'person_username_unique')
    })
  }
}

module.exports = PersonUniqueSchema
