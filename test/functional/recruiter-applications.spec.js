'use strict'

const moment = require('moment')
const clearDatabase = require('../clearDatabase')

const Factory = use('Factory')
const { test, trait, beforeEach } = use('Test/Suite')('Browser: /recruiter/applications')

beforeEach(async () => {
  await clearDatabase()
})

trait('Test/Browser')

async function logInRecruiter(browser) {
  const recruiter = await Factory.model('App/Models/Person').create({ role: 'recruiter', password: '12345' })
  const page = await browser.visit('/login')
  await page
    .type('[name="username"]', recruiter.username)
    .type('[name="password"]', '12345')
    .submitForm('form')
    .waitForNavigation()
  return page
}

test('Renders applications search form', async ({ browser, assert }) => {
  const page = await logInRecruiter(browser)

  const hasFromDateInput = await page.hasElement('input#availability_from')
  const hasToDateInput = await page.hasElement('input#availability_to')
  const hasApplicationDateInput = await page.hasElement('input#application_date')
  const hasCompetenceInput = await page.hasElement('select#competence')
  const hasNameInput = await page.hasElement('input#name')

  assert.isTrue(hasFromDateInput)
  assert.isTrue(hasToDateInput)
  assert.isTrue(hasApplicationDateInput)
  assert.isTrue(hasCompetenceInput)
  assert.isTrue(hasNameInput)
}).timeout(10000)

test('Returns and renders search results', async ({ browser, assert }) => {
  const fromDate = moment()
  const toDate = moment().add(10, 'days')

  // Create all database entries needed
  const person = await Factory.model('App/Models/Person').create()
  const competence = await Factory.model('App/Models/Competence').create()
  await Factory.model('App/Models/Availability').create({
    person_id: person.person_id,
    from: fromDate.unix(),
    to: toDate.unix(),
  })
  await Factory.model('App/Models/CompetenceProfile').create({
    person_id: person.person_id,
    competence_id: competence.competence_id,
  })

  const page = await logInRecruiter(browser)

  await page
    .submitForm('form')
    .waitForNavigation()

  const hasOneEntryInSearchResult = await page.hasElement('tbody tr')
  const hasLinkInEntry = await page.hasElement('tbody tr td a')

  // Verify that search result table has been populated
  assert.isTrue(hasOneEntryInSearchResult)
  assert.isTrue(hasLinkInEntry)
}).timeout(10000)
