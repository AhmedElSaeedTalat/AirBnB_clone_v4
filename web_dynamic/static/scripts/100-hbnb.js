$('document').ready(function () {
  // check-box amenity
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

  // check-box state - city
  // create dict with states and cities checked {state: [{id: name}], cities: [{id: name}]}
  const state_city = {};
  $('.locations input:checkbox').change(function () {
    if ($(this).is(':checked')) {
      if ($(this).attr('data-type') === 'state') {
		  if (state_city['state']) {
		    state_city['state'].push({[$(this).attr('data-id')]: $(this).attr('data-name')});
		  } else {
		    state_city['state'] = [{[$(this).attr('data-id')]: $(this).attr('data-name')}];
		  }
      } else {
		  if (state_city['city']) {
		    state_city['city'].push({[$(this).attr('data-id')]: $(this).attr('data-name')});
		  } else {
		    state_city['city'] = [{[$(this).attr('data-id')]: $(this).attr('data-name')}];
		  }
	  }
    } else {
      const id = $(this).attr('data-id');
		  Object.keys(state_city).forEach(function (item) {
			state_city[item].forEach(function (obj, index){
				if (Object.keys(obj)[0] === id) {
					state_city[item].splice(index, 1)
				}
			});
		  });
	  }
    // append names of states and cities to h4	
    let text = ''
    Object.keys(state_city).forEach(function(item) {
      state_city[item].forEach(function (obj) {
        if (text === '') {
          text = Object.values(obj)[0];
        } else {
          text += ', ' + Object.values(obj)[0];
          }
        });
    });
    $('.locations h4').text(text);
  
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
  // click search results
  $('.filters button').click(function () {
    const list = [];
    for (const key in dictIds) {
		list.push(dictIds[key]);
	}
	listSatesIds = []
    listCitiesIds = []
    Object.keys(state_city).forEach(function (item) {
      state_city[item].forEach(function (obj, index){
        if (item === 'state') {
          listSatesIds.push(Object.keys(obj)[0])
		} else {
          listCitiesIds.push(Object.keys(obj)[0])
		}
	  });
    });
    $.post({
      url: `http://0.0.0.0:5001/api/v1/places_search`,
      data: JSON.stringify({"states": listSatesIds, "cities":listCitiesIds, "amenities": list}),
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
