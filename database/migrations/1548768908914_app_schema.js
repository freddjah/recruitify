'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AppSchema extends Schema {

  up() {

    this.create('role', table => {
      table.bigIncrements('role_id')
      table.string('name')
    })

    this.create('person', table => {
      table.bigIncrements('person_id')
      table.string('name')
      table.string('surname')
      table.string('ssn')
      table.string('email')
      table.string('password')
      table.bigInteger('role_id').unsigned().references('role_id').inTable('role')
      table.string('username')
    })

    this.create('availability', table => {
      table.bigIncrements('availability_id')
      table.bigInteger('person_id').unsigned().references('person_id').inTable('person')
      table.date('from_date')
      table.date('to_date')
    })

    this.create('competence', table => {
      table.bigIncrements('competence_id')
      table.string('name')
    })

    this.create('competence_profile', table => {
      table.bigIncrements('competence_profile_id')
      table.bigInteger('person_id').unsigned().references('person_id').inTable('person')
      table.bigInteger('competence_id').unsigned().references('competence_id').inTable('competence')
      table.decimal('years_of_experience', 4, 2)
    })
  }

  down() {

    this.drop('role')
    this.drop('person')
    this.drop('availability')
    this.drop('competence')
    this.drop('competence_profile')
  }
}

module.exports = AppSchema
