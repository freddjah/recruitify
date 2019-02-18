$(() => {

  $('#add_expertise').click(event => {

    event.preventDefault()

    $('#expertises .empty-state').remove()

    const competenceId = $('#competence').val()
    const competenceName = $('#competence option:selected').text()

    const yearsOfExperience = $('#years_of_experience').val()

    $('#expertises').append(`<tr> <td>${competenceName}</td> <td>${yearsOfExperience}</td> </tr>`)
    $('form').append(`<input type="hidden" name="expertiseCompetenceId[]" value="${competenceId}">`)
    $('form').append(`<input type="hidden" name="expertiseYearsOfExperience[]" value="${yearsOfExperience}">`)
  })

  $('#add_availability').click(event => {

    event.preventDefault()

    $('#availabilities .empty-state').remove()

    const availabilityFrom = $('#availability_from').val()
    const availabilityTo = $('#availability_to').val()

    $('#availabilities').append(`<tr> <td>${availabilityFrom}</td> <td>${availabilityTo}</td> </tr>`)
    $('form').append(`<input type="hidden" name="availabilityFrom[]" value="${availabilityFrom}">`)
    $('form').append(`<input type="hidden" name="availabilityTo[]" value="${availabilityTo}">`)
  })
})
