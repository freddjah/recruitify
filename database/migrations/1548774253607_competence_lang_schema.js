'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CompetenceLangSchema extends Schema {
  up() {
    this.table('competence', table => {
      table.renameColumn('name', 'name_sv')
      table.string('name_en').after('name')
    })
  }

  down() {
    this.table('competence', table => {
      table.dropColumn('name_en')
      table.renameColumn('name_sv', 'name')
    })
  }
}

module.exports = CompetenceLangSchema
