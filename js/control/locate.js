import $ from 'jquery';
import Overlay from 'ol/Overlay';
import {getLocationOverlay, getView} from '../util';
import {showAlert} from './dialog';
import {hidePopup} from './popup';
import {sortByDistance} from '../list/list';

const env = import.meta.env;
const token = env.VITE_ARC_TOKEN;
const endpoint = env.VITE_GEOCODE_URL;

const searchRequest = 'findAddressCandidates?f=pjson&outSR=3857'
  + `&token=${token}&singleLine=`;

const suggestRequest = 'suggest?f=json'
  + `&token=${token}&text=`;

const featureUrl = env.VITE_SECONDARY_URL;

function searchLocation(input) {
  const url = `${endpoint}${searchRequest}${encodeURIComponent(input)}`;
  return new Promise((resolve, reject) => {
    fetch(url).then(response => {
      response.json().then(possible => {
        if (possible.error) {
          reject(possible.error);
        }
        resolve(possible.candidates);
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    }).catch(error => {
      console.error(error);
      reject(error);
    });
  });
}

function suggestLocations(partial) {
  if (!$('#search-lid').is(':checked')) {
    const url = `${endpoint}${suggestRequest}${encodeURIComponent(partial)}`;
    return new Promise((resolve, reject) => {
      fetch(url).then(response => {
        response.json().then(possible => {
          if (possible.error) {
            reject(possible.error);
          }
          resolve(possible.suggestions);
        }).catch(error => {
          console.error(error);
          reject(error);
        });
      }).catch(error => {
        console.error(error);
        reject(error);
      });
    });
  }
}

function handleSearch(event) {
  const search = $('#search').val().trim();
  event.preventDefault();
  if (search) {
    $('#locate button').addClass('loading');
    $('#possible').slideUp();

    if (!$('#search-lid').is(':checked')) {
      searchLocation(search).then(candidates => {
        if (candidates.length > 0) {
          if (candidates.length === 1 || candidates[0].score === 100) {
            displayOnMap(candidates[0]);
          } else {
            displayCandidates(candidates);
          }
        } else {
          notFound(search);
        }
      }).catch(error => console.error(error));  
    } else {
      findById(search, coord => {
        if (coord) {
          displayOnMap({
            location: {x: coord[0], y: coord[1]},
            address: ''
          });        
        } else {
          notFound(search);
        }
      });
    }
  }
}

function notFound(search) {
  const message = $(`<span>"${search}"</span> <span data-i18n="dialog.not_found"></span>`);
  showAlert(message.localize());
  $('#locate button').removeClass('loading');
}

function handleSuggest(event) {
  if (!$('#search-lid').is(':checked')) {
    if (event.code !== 'Enter') {
      const partial = $('#search').val();
      if (partial.length > 3) {
        suggestLocations(partial).then(suggestions => {
          displaySuggestions(suggestions);
        }).catch(error => console.error(error));
      }
    }
  }
}

function displayPossible(possibles, textOrAddress) {
  const added = {};
  const list = $('#possible').empty();
  possibles.forEach(possible => {
    const location = possible[textOrAddress];
    if (added[location] === undefined) {
      const li = $(`<li class="list-group-item focus-ring" 
        tabindex="0">${location}</li>`);
      added[location] = true;
      li.on('click', event => {
        list.slideUp();
        $('#search').val(li.html());
        $('#locate').trigger('submit');
      });
      list.append(li);
    }
  });
  list.slideDown();
}

function displayCandidates(candidates) {
  displayPossible(candidates, 'address');
}

function displaySuggestions(suggestions) {
  displayPossible(suggestions, 'text');
}

function gottaMove(currentCenter, newCenter) {
  return currentCenter[0] !== newCenter[0] || currentCenter[1] !== newCenter[1];
}

function displayOnMap(candidate) {
  const view = getView();
  const location = [candidate.location.x, candidate.location.y];
  if (gottaMove(view.getCenter(), location)) {
    const address = candidate.address;
    const locationOverlay = getLocationOverlay();
    locationOverlay.setPosition(location);
    sortByDistance(location);
    view.animate({zoom: 14, center: location},
      () => {
        $('#locate button').removeClass('loading');
        $(locationOverlay.getElement())
          .attr('title', address)
          .attr('aria-label', address);
    });
    hidePopup();
  } else {
    $('#locate button').removeClass('loading');
  }
}

export function createLocator(map) {
  const form = $('<form id="locate"></form>');
  const div = $('<div class="form-group search-map"><ul id="possible" class="list-group"></ul><button type="submit" class="btn btn-primary focus-ring" data-i18n="[aria-label]search"><div></div></button></div>');
  const input = $('<input type="text" class="form-control focus-ring" id="search" data-i18n="[placeholder]form.search.placeholder;[aria-label]form.search.placeholder">');
  const possible = div.find('#possible');

  form.append(div.prepend(input)).localize();
  form.insertBefore($('#time-frame'));

  $(document).on('click', () => $('#possible').slideUp());
  possible.on('keyup', event => {
    if (event.key === 'Escape') possible.slideUp();
  });
  $(document).on('keyup', event => {
    const target = event.target;
    if (event.key === 'Tab'
      && target.id !== 'possible'
      && !$.contains(possible.get(0), target)) {
        possible.slideUp();
      }
  });
  $('body').append('<div id="location" class="location"></div>');
  const locationOverlay = new Overlay({
    element: $('#location').get(0),
    offset: [-16, -28],
    className: 'overlay-0 ol ol-overlay-container ol-selectable'
  });

  map.addOverlay(locationOverlay);
  map.set('locationOverlay', locationOverlay);
  $(form).on('submit', handleSearch);
  $('#search').on('keyup', handleSuggest);
}
