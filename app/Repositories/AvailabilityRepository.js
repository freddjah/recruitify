'use strict'

/**
 * Repository for Availability
 * Handles functions for database requests
 */
class AvailabilityRepository {

  /**
   * Creates a new availability in database
   * @param {Object} availabilityData
   * @param {string} availabilityData.personId
   * @param {string} availabilityData.fromDate
   * @param {string} availabilityData.toDate
   * @returns {Promise<availabilityModel>} - A promise that can be awaited which resolves to a Availability object.
   */
  static create({ personId, fromDate, toDate }) {

    const Availability = use('App/Models/Availability')

    return Availability.create({
      person_id: personId,
      from_date: fromDate,
      to_date: toDate,
    })
  }

  static deleteByPersonId(personId) {

    const Availability = use('App/Models/Availability')
    return Availability.query().where('person_id', personId).delete()
  }
}

module.exports = AvailabilityRepository
