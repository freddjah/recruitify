'use strict'

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

test('Renders applications search results', async ({ browser, assert }) => {
  const person = await Factory.model('App/Models/Person').create()
  const competence = await Factory.model('App/Models/Competence').create()
  const availability = await Factory.model('App/Models/Availability').create({ person_id: person.person_id })
  const competenceProfile = await Factory.model('App/Models/CompetenceProfile').create({
    person_id: person.person_id,
    competence_id: competence.competence_id,
  })

  const page = await logInRecruiter(browser)

  console.log(person.toJSON())
  console.log(availability.toJSON())
  console.log(competenceProfile.toJSON())

  await page
    .type('[name="from"]', '')
    .type('[name="to"]', '')
    // .type('[name="date"]', person.application_date)
    .submitForm('form')
    .waitForNavigation()

  const html = await page.getHtml()

  console.log(page)
}).timeout(10000)
