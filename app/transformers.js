function createTransformers(lang) {

  const transformCompetenceProfile = competenceProfile => ({
    years_of_experience: competenceProfile.years_of_experience,
    competence: transformCompetence(competenceProfile.getRelated('competence')),
  })

  const transformAvailability = availability => ({
    from_date: availability.from_date,
    to_date: availability.to_date,
  })

  const transformCompetence = competence => ({
    competence_id: competence.competence_id,
    name: competence[`name_${lang}`],
  })

  const transformPerson = person => ({
    person_id: person.person_id,
    name: person.name,
    surname: person.surname,
    ssn: person.ssn,
    email: person.email,
    username: person.username,
    application_date: person.application_date,
    application_status: person.application_status,
    application_reviewed_at: person.application_reviewed_at,
  })

  return {
    transformCompetenceProfile,
    transformAvailability,
    transformCompetence,
    transformPerson,
  }
}

module.exports = createTransformers
