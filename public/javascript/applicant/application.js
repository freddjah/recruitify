$(() => {

  $('#add_expertise').click(event => {

    event.preventDefault()
    const competenceId = $('#competence').val()
    const competenceName = $('#competence option:selected').text()

    const yearsOfExperience = $('#years_of_experience').val()

    $('#expertises').append(`<li>${competenceName} - ${yearsOfExperience} years</li>`)
    $('form').append(`<input type="hidden" name="expertiseCompetenceId[]" value="${competenceId}">`)
    $('form').append(`<input type="hidden" name="expertiseYearsOfExperience[]" value="${yearsOfExperience}">`)
  })

  $('#add_availability').click(event => {

    event.preventDefault()
    const availabilityFrom = $('#availability_from').val()
    const availabilityTo = $('#availability_to').val()

    $('#availabilities').append(`<li>${availabilityFrom} to ${availabilityTo}</li>`)
    $('form').append(`<input type="hidden" name="availabilityFrom[]" value="${availabilityFrom}">`)
    $('form').append(`<input type="hidden" name="availabilityTo[]" value="${availabilityTo}">`)
  })
})
