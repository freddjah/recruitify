'use strict'

const moment = require('moment')
const clearDatabase = require('../clearDatabase')

const Factory = use('Factory')
const { test, trait, beforeEach } = use('Test/Suite')('Browser: /recruiter/applications/:id')

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

test('Can view a specific application', async ({ browser, assert }) => {
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

  await logInRecruiter(browser)

  const page = await browser.visit(`/recruiter/applications/${person.person_id}`)

  const hasUpdateForm = await page.hasElement('form')

  assert.isTrue(hasUpdateForm)
}).timeout(10000)

test('Can save status', async ({ browser, assert }) => {
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

  const reviewedAtBefore = person.application_reviewed_at

  await logInRecruiter(browser)

  const page = await browser.visit(`/recruiter/applications/${person.person_id}`)

  await page
    .click('form button')
    .waitForNavigation()

  await person.reload()

  // Verify that it has been updated
  assert.notEqual(reviewedAtBefore, person.application_reviewed_at)

}).timeout(10000)
