'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompetenceLangEnGbSchema extends Schema {
  up() {
    this.table('competence', table => {
      table.string('name_en_gb').after('name_en')
    })
  }

  down() {
    this.table('competence', table => {
      table.dropColumn('name_en_gb')
    })
  }
}

module.exports = CompetenceLangEnGbSchema
