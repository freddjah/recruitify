'use strict'

/*
|--------------------------------------------------------------------------
| RoleSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

const Database = use('Database')

class RoleSeeder {
  async run() {

    await Database.table('role').insert({ role_id: 1, name: 'recruiter' })
    await Database.table('role').insert({ role_id: 2, name: 'applicant' })
  }
}

module.exports = RoleSeeder
