$(() => {

  $('#add_expertise').click(event => {

    event.preventDefault()
    const competenceId = $('#competence').val()
    const competenceName = $('#competence option:selected').text()

    const yearsOfExperience = $('#years_of_experience').val()

    $('#expertises').append(`<li>${competenceName} - ${yearsOfExperience} years</li>`)
    $('form').append(`<input type="hidden" name="expertise_competence_id[]" value="${competenceId}">`)
    $('form').append(`<input type="hidden" name="expertise_years_of_experience[]" value="${yearsOfExperience}">`)
  })

  $('#add_availability').click(event => {

    event.preventDefault()
    const availabilityFrom = $('#availability_from').val()
    const availabilityTo = $('#availability_to').val()

    $('#availabilities').append(`<li>${availabilityFrom} to ${availabilityTo}</li>`)
    $('form').append(`<input type="hidden" name="availability_from[]" value="${availabilityFrom}">`)
    $('form').append(`<input type="hidden" name="availability_to[]" value="${availabilityTo}">`)
  })
})
