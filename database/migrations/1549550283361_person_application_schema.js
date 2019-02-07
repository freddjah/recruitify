'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonApplicationSchema extends Schema {
  up() {
    this.table('person', table => {
      table.date('application_date').nullable()
      table.enu('application_status', ['accepted', 'rejected', 'unhandled']).nullable()
      table.datetime('application_reviewed_at').nullable()
    })
  }

  down() {
    this.table('person', table => {
      table.dropColumn('application_date')
      table.dropColumn('application_status')
      table.dropColumn('application_reviewed_at')
    })
  }
}

module.exports = PersonApplicationSchema
