'use strict'

/** @type {import('@adonisjs/framework/src/Server')} */
const Server = use('Server')
const View = use('View')

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
|
| Global middleware are executed on each http request only when the routes
| match.
|
*/
const globalMiddleware = [
  'Adonis/Middleware/BodyParser',
  'Adonis/Middleware/Session',
  'Adonis/Middleware/Shield',
  'Adonis/Middleware/AuthInit',
  'App/Middleware/Locale',
  'App/Middleware/ConvertEmptyStringsToNull',
]

/*
|--------------------------------------------------------------------------
| Named Middleware
|--------------------------------------------------------------------------
|
| Named middleware is key/value object to conditionally add middleware on
| specific routes or group of routes.
|
| // define
| {
|   auth: 'Adonis/Middleware/Auth'
| }
|
| // use
| Route.get().middleware('auth')
|
*/
const namedMiddleware = {
  auth: 'Adonis/Middleware/Auth',
  guest: 'Adonis/Middleware/AllowGuestOnly',
  role: 'App/Middleware/Role',
  createApplicationValidator: 'App/Middleware/Validators/CreateApplicationValidator',
  updateStatusValidator: 'App/Middleware/Validators/UpdateStatusValidator',
  registerPersonValidator: 'App/Middleware/Validators/RegisterPersonValidator',
}

/*
|--------------------------------------------------------------------------
| Server Middleware
|--------------------------------------------------------------------------
|
| Server level middleware are executed even when route for a given URL is
| not registered. Features like `static assets` and `cors` needs better
| control over request lifecycle.
|
*/
const serverMiddleware = [
  'Adonis/Middleware/Static',
  'Adonis/Middleware/Cors',
]

View.global('qs', (q1 = {}, q2 = {}) => {
  const params = Object.assign({}, q1, q2)
  return Object.keys(params).map(key => `${key}=${params[key]}`).join('&')
})

Server
  .registerGlobal(globalMiddleware)
  .registerNamed(namedMiddleware)
  .use(serverMiddleware)
