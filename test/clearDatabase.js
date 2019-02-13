'use strict'

const Database = use('Database')

const excludeTables = [
  'adonis_schema',
  'sqlite_sequence',
  'role',
]

async function clearDatabase() {

  const tables = await Database.raw("SELECT * FROM sqlite_master WHERE type='table'")

  const truncateTables = tables
    .map(({ tbl_name: table }) => table)
    .filter(table => !excludeTables.includes(table))

  for (const table of truncateTables) {
    await Database.truncate(table)
  }
}

module.exports = clearDatabase
