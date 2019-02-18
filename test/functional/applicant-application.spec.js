'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Browser: /applicant/application')
const clearDatabase = require('../clearDatabase')

const { beforeEach } = use('Test/Suite')('Controllers/Http/Outside/AuthenticationController')

trait('Test/Browser')

beforeEach(async () => {

  await clearDatabase()

})

test('Renders application page for applicant', async ({ browser, assert }) => {

  const page = await browser.visit('/login')
  const person = await Factory.model('App/Models/Person').create({ password: '12345' })

  await page
    .type('[name="username"]', person.username)
    .type('[name="password"]', '12345')
    .submitForm('form')
    .waitForNavigation()

  const hasCompetenceInput = await page.hasElement('select#competence')
  const hasYearsOfExperienceInput = await page.hasElement('input#years_of_experience')
  const hasAvailabilityFromInput = await page.hasElement('input#availability_from')
  const hasAvailabilityToInput = await page.hasElement('input#availability_to')

  assert.isTrue(hasCompetenceInput)
  assert.isTrue(hasYearsOfExperienceInput)
  assert.isTrue(hasAvailabilityFromInput)
  assert.isTrue(hasAvailabilityToInput)
}).timeout(10000)

test('Send application succeeds', async ({ browser, assert }) => {

  const page = await browser.visit('/login')
  const person = await Factory.model('App/Models/Person').create({ password: '12345' })
  const competence = await Factory.model('App/Models/Competence').create()

  await page
    .type('[name="username"]', person.username)
    .type('[name="password"]', '12345')
    .submitForm('form')
    .waitForNavigation()

  await page
    .type('select#competence', competence.name_en)
    .type('input#years_of_experience', '2')
    .click('button#add_expertise')
    .type('input#availability_from', '2019-02-15')
    .type('input#availability_to', '2019-02-20')
    .click('button#add_availability')
    .submitForm('form')
    .waitForNavigation()

  const hasSuccessMessageFeedback = await page.hasElement('div.alert-success')

  assert.isTrue(hasSuccessMessageFeedback)

}).timeout(10000)

test('Send application fails due to missing fields', async ({ browser, assert }) => {

  const page = await browser.visit('/login')
  const person = await Factory.model('App/Models/Person').create({ password: '12345' })

  await page
    .type('[name="username"]', person.username)
    .type('[name="password"]', '12345')
    .submitForm('form')
    .waitForNavigation()

  await page
    .submitForm('form')
    .waitForNavigation()

  const hasSuccessMessageFeedback = await page.hasElement('div.alert-success')
  const hasMissingFieldsFeedback = await page.hasElement('div.invalid-feedback')

  assert.isFalse(hasSuccessMessageFeedback)
  assert.isTrue(hasMissingFieldsFeedback)

}).timeout(10000)
