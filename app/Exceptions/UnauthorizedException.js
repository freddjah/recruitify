'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class UnauthorizedException extends LogicalException {
  /**
   * Handle this exception by itself
   */
  // handle () {}
}

module.exports = UnauthorizedException
