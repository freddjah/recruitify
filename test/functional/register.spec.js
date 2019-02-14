'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Browser: /register')
const clearDatabase = require('../clearDatabase')

const { beforeEach } = use('Test/Suite')('Controllers/Http/Outside/AuthenticationController')

trait('Test/Browser')

beforeEach(async () => {

  await clearDatabase()

})

test('Renders login page', async ({ browser, assert }) => {

  const page = await browser.visit('/register')
  const hasNameInput = await page.hasElement('input[name="name"]')
  const hasSurnameInput = await page.hasElement('input[name="surname"]')
  const hasSsnInput = await page.hasElement('input[name="ssn"]')
  const hasEmailInput = await page.hasElement('input[name="email"]')
  const hasUsernameInput = await page.hasElement('input[name="username"]')
  const hasPasswordInput = await page.hasElement('input[name="password"]')
  const hasSubmitButton = await page.hasElement('button[type="submit"]')

  assert.isTrue(hasNameInput)
  assert.isTrue(hasSurnameInput)
  assert.isTrue(hasSsnInput)
  assert.isTrue(hasEmailInput)
  assert.isTrue(hasUsernameInput)
  assert.isTrue(hasPasswordInput)
  assert.isTrue(hasSubmitButton)
}).timeout(10000)

test('Successfully register', async ({ browser }) => {

  const page = await browser.visit('/register')

  await page
    .type('[name="name"]', 'test')
    .type('[name="surname"]', 'test')
    .type('[name="email"]', 'test@hotmail.com')
    .type('[name="ssn"]', '19240921-2011')
    .type('[name="username"]', 'test')
    .type('[name="password"]', 'test')
    .type('[name="password_confirmation"]', 'test')
    .submitForm('form')
    .waitForNavigation()
    .assertPath('/register/done')

}).timeout(10000)

test('Register fails due to existing user', async ({ browser, assert }) => {

  const page = await browser.visit('/register')
  const person = await Factory.model('App/Models/Person').create({ password: '12345' })

  await page
    .type('[name="name"]', 'test')
    .type('[name="surname"]', 'test')
    .type('[name="email"]', 'test@hotmail.com')
    .type('[name="ssn"]', '19240921-2011')
    .type('[name="username"]', person.username)
    .type('[name="password"]', 'test')
    .type('[name="password_confirmation"]', 'test')
    .submitForm('form')
    .waitForNavigation()

  const hasExistingUsernameFeedback = await page.hasElement('div.invalid-feedback')

  assert.isTrue(hasExistingUsernameFeedback)

}).timeout(10000)

test('Register fails due to passwords not matching', async ({ browser, assert }) => {

  const page = await browser.visit('/register')

  await page
    .type('[name="name"]', 'test')
    .type('[name="surname"]', 'test')
    .type('[name="email"]', 'test@hotmail.com')
    .type('[name="ssn"]', '19240921-2011')
    .type('[name="username"]', 'test')
    .type('[name="password"]', 'test')
    .type('[name="password_confirmation"]', 'annat')
    .submitForm('form')
    .waitForNavigation()

  const hasConflictingPasswordsFeedback = await page.hasElement('div.invalid-feedback')

  assert.isTrue(hasConflictingPasswordsFeedback)

}).timeout(10000)

test('Register fails due to wrong email format', async ({ browser, assert }) => {

  const page = await browser.visit('/register')

  await page
    .type('[name="name"]', 'test')
    .type('[name="surname"]', 'test')
    .type('[name="email"]', 'test12wrongformat')
    .type('[name="ssn"]', '19240921-2011')
    .type('[name="username"]', 'test')
    .type('[name="password"]', 'test')
    .type('[name="password_confirmation"]', 'test')
    .submitForm('form')
    .waitForNavigation()

  const hasWrongEmailFormatFeedback = await page.hasElement('div.invalid-feedback')

  assert.isTrue(hasWrongEmailFormatFeedback)

}).timeout(10000)

test('Register fails due to empty field', async ({ browser, assert }) => {

  const page = await browser.visit('/register')

  await page
    .type('[name="name"]', '')
    .type('[name="surname"]', 'test')
    .type('[name="email"]', 'test12wrongformat')
    .type('[name="ssn"]', '19240921-2011')
    .type('[name="username"]', 'test')
    .type('[name="password"]', 'test')
    .type('[name="password_confirmation"]', 'test')
    .submitForm('form')
    .waitForNavigation()

  const hasEmptyFieldFeedback = await page.hasElement('div.invalid-feedback')

  assert.isTrue(hasEmptyFieldFeedback)

}).timeout(10000)
