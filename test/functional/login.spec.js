'use strict'

const Factory = use('Factory')
const { test, trait } = use('Test/Suite')('Browser: /login')

trait('Test/Browser')

test('Renders login page', async ({ browser, assert }) => {

  const page = await browser.visit('/login')
  const hasUsernameInput = await page.hasElement('input[name="username"]')
  const hasPasswordInput = await page.hasElement('input[name="password"]')
  const hasSubmitButton = await page.hasElement('button[type="submit"]')

  assert.isTrue(hasUsernameInput)
  assert.isTrue(hasPasswordInput)
  assert.isTrue(hasSubmitButton)
}).timeout(10000)

test('Log in user succeeds', async ({ browser }) => {

  const page = await browser.visit('/login')
  const person = await Factory.model('App/Models/Person').create({ password: '12345' })

  await page
    .type('[name="username"]', person.username)
    .type('[name="password"]', '12345')
    .submitForm('form')
    .waitForNavigation()
    .assertPath('/applicant/application')

}).timeout(10000)

test('Log in with wrong password', async ({ browser, assert }) => {

  const page = await browser.visit('/login')
  const person = await Factory.model('App/Models/Person').create({ password: '12345' })

  await page
    .type('[name="username"]', person.username)
    .type('[name="password"]', '123fel')
    .submitForm('form')
    .waitForNavigation()

  const hasInvalidPasswordFeedback = await page.hasElement('div.invalid-feedback')
  const hasCorrectUsername = await page.getValue('input[name="username"]')

  assert.isTrue(hasInvalidPasswordFeedback)
  assert.equal(hasCorrectUsername, person.username)

}).timeout(10000)

test('Log in with non-existing user', async ({ browser, assert }) => {

  const page = await browser.visit('/login')

  await page
    .type('[name="username"]', 'wrongUsername')
    .type('[name="password"]', '123wrong')
    .submitForm('form')
    .waitForNavigation()

  const hasInvalidUsernameFeedback = await page.hasElement('div.invalid-feedback')
  const hasCorrectUsername = await page.getValue('input[name="username"]')

  assert.isTrue(hasInvalidUsernameFeedback)
  assert.equal(hasCorrectUsername, 'wrongUsername')

}).timeout(10000)
