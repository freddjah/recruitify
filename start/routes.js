'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'HomeController.home').middleware('auth')

// Outside
Route.get('/login', 'Outside/AuthenticationController.loginForm').middleware('guest')
Route.post('/login', 'Outside/AuthenticationController.login').middleware('guest')
Route.get('/logout', 'Outside/AuthenticationController.logout')
Route.get('/register', 'Outside/AuthenticationController.registerForm').middleware('guest')
Route.post('/register', 'Outside/AuthenticationController.register').validator('RegisterPerson').middleware('guest')
Route.get('/register/done', 'Outside/AuthenticationController.registerDone').middleware('guest')

// Inside
Route.get('/applicant', 'Inside/Applicant/ApplicationController.index')
Route.get('/applicant/application', 'Inside/Applicant/ApplicationController.applicationForm')
Route.post('/applicant/application', 'Inside/Applicant/ApplicationController.saveApplication')

Route.get('/recruiter', 'Inside/Recruiter/ApplicationController.index')
Route.get('/recruiter/applications', 'Inside/Recruiter/ApplicationController.searchForm')
Route.get('/recruiter/applications/search', 'Inside/Recruiter/ApplicationController.searchResults')
