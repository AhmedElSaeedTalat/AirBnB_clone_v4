$('document').ready(function () {
  const dictIds = {};
  $('.amenities input:checkbox').change(function () {
    if ($(this).is(':checked')) {
      dictIds[$(this).attr('data-name')] = $(this).attr('data-id');
    } else {
      delete dictIds[$(this).attr('data-name')];
    }
    let names = '';
    for (const key in dictIds) {
      if (names === '') {
        names = key;
        continue;
      }
      names = names + ', ' + key;
    }
    $('.amenities h4').text(names);
  });
  // request status
  $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
  // fetch data about places
  // fetch
  $.post({
    url: 'http://0.0.0.0:5001/api/v1/places_search',
    data: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json'
    },
    success: (data) => {
      data.forEach((place) =>
        $('section.places').append(
          `<article>
           <div class="title_box">
           <h2>${place.name}</h2>
           <div class="price_by_night">$${place.price_by_night}</div>
           </div>
           <div class="information">
           <div class="max_guest">${place.max_guest} Guest${
             place.max_guest !== 1 ? 's' : ''
               }</div>
             <div class="number_rooms">${place.number_rooms} Bedroom${
               place.number_rooms !== 1 ? 's' : ''
              }</div>
             <div class="number_bathrooms">${place.number_bathrooms} Bathroom${
               place.number_bathrooms !== 1 ? 's' : ''
               }</div>
             </div> 
             <div class="description">
               ${place.description}
             </div>
             </article>`
        ));
    },
		dataType: 'json',
	});
  $('.filters button').click(function () {
    const list = [];
    for (const key in dictIds) {
		list.push(dictIds[key]);
	}
    $.post({
      url: `http://0.0.0.0:5001/api/v1/places_search`,
      data: JSON.stringify({"amenities": list}),
      headers: {
        'Content-Type': 'application/json',
      },
      success: (data) => {
        $('section.places').empty()
        data.forEach((place) =>
          $('section.places').append(
					`<article>
			<div class="title_box">
			<h2>${place.name}</h2>
			<div class="price_by_night">$${place.price_by_night}</div>
			</div>
			<div class="information">
			<div class="max_guest">${place.max_guest} Guest${
						place.max_guest !== 1 ? 's' : ''
				}</div>
			<div class="number_rooms">${place.number_rooms} Bedroom${
						place.number_rooms !== 1 ? 's' : ''
					}</div>
			<div class="number_bathrooms">${place.number_bathrooms} Bathroom${
						place.number_bathrooms !== 1 ? "s" : ""
					}</div>
			</div> 
			<div class="description">
			${place.description}
			</div>
				</article>`
        ));
    },
		dataType: 'json',
	});
  });	
});
