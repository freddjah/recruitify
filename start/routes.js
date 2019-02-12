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
Route.get('/logout', 'Outside/AuthenticationController.logout')

Route.group(() => {
  Route.get('/login', 'Outside/AuthenticationController.loginForm')
  Route.post('/login', 'Outside/AuthenticationController.login')
  Route.get('/register', 'Outside/AuthenticationController.registerForm')
  Route.post('/register', 'Outside/AuthenticationController.register').middleware('registerPersonValidator')
  Route.get('/register/done', 'Outside/AuthenticationController.registerDone')
}).middleware('guest')

// Inside
Route.group(() => {
  Route.get('/', 'Inside/Applicant/ApplicationController.index')
  Route.get('application', 'Inside/Applicant/ApplicationController.applicationForm')
  Route.post('application', 'Inside/Applicant/ApplicationController.saveApplication').middleware('createApplicationValidator')
}).prefix('/applicant').middleware(['auth', 'role:applicant'])

Route.group(() => {
  Route.get('/', 'Inside/Recruiter/ApplicationController.index')
  Route.get('applications', 'Inside/Recruiter/ApplicationController.searchForm')
  Route.get('applications/search', 'Inside/Recruiter/ApplicationController.searchResults')
  Route.get('applications/:personId', 'Inside/Recruiter/ApplicationController.view')
  Route.post('applications/:personId', 'Inside/Recruiter/ApplicationController.updateStatus').middleware('updateStatusValidator')
}).prefix('/recruiter').middleware(['auth', 'role:recruiter'])

Route.group(() => {
  Route.get('competences', 'ApiController.getCompetences')
  Route.get('statuses', 'ApiController.getStatuses')
  Route.post('login', 'ApiController.login')
  Route.post('register', 'ApiController.register').middleware('registerPersonValidator')
}).prefix('/api')

Route.group(() => {
  Route.post('applicant/application', 'ApiController.saveApplication').middleware(['role:applicant', 'createApplicationValidator'])
  Route.get('recruiter/applications', 'ApiController.searchResults').middleware('role:recruiter')
  Route.get('recruiter/applications/:personId', 'ApiController.view').middleware('role:recruiter')
  Route.post('recruiter/applications/:personId', 'ApiController.updateStatus').middleware(['role:recruiter', 'updateStatusValidator'])
}).middleware('auth:jwt').prefix('/api')
