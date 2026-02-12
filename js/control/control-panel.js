import $ from 'jquery';
import {getBorderStyle, getStateLayer, getLocationLayer, setFuture, getFuture} from '../util';
import countStyle from '../layer/style/state';
import {updateLegend} from './legend';
import animate from '../layer/animate';
import createTrainingRequest from './request';

const storyUrl = import.meta.env.VITE_STORIES_URL;
const statsUrl = import.meta.env.VITE_STATS_URL;

const timeForm = $('#time-type').get(0);
const mapForm = $('#map-type').get(0);
const locationLayer = getLocationLayer();
const stateLayer = getStateLayer();

function showControlPanel(event) {
  if ($(window).width() < 575) {
    const css = event.target.id === 'map-tab' ? 'map' : 'detail';
    $('#show-view').removeClass('map').removeClass('detail');
    $('#show-view').addClass(css);
    $('#control-panel').slideDown();
  } else {
    showView();
  }
}

function showExternal(view) {
  const type = view.split(':')[0];
  $('#external').attr('src', type === 'stories' ? storyUrl : statsUrl);
}

function getSelectedView() {
  const future = timeForm.choice.value === 'future';
  setFuture(future);
  if ($('#location-tab').hasClass('active')) return `detail${future ? ':future' : ''}`;
  if ($('#stats-tab').hasClass('active')) return 'external:stats';
  if ($('#stories-tab').hasClass('active')) return 'external:stories';
  if ($('#request-tab').hasClass('active')) return 'request';
  return `map:${mapForm.choice.value}`;
}

function displayLocationMap() {
  const style = locationLayer.getStyle();
  locationLayer.setVisible(true);
  locationLayer.setStyle(locationLayer.get('blankStyle'));
  locationLayer.setStyle(style);
  stateLayer.setStyle(getBorderStyle());
  updateLegend();
}

function displayStateMap() {
  locationLayer.setVisible(false);
  stateLayer.setStyle(countStyle);
  updateLegend();
}

function setControlPanelCss(view) {
  const primaryView = view.split(':')[0];
  const subView = view.split(':')[1];
  const future = getFuture();
  $('#time-type label').removeClass('active');
  if (future) {
    $('body').addClass('future');
    $('#time-type label[for="future-sessions"]').addClass('active');
  } else {
    $('body').removeClass('future');
    $('#time-type label[for="past-sessions"]').addClass('active');
  }
  if ($(window).width() < 575 || primaryView === 'external') {
    $('#control-panel').slideUp();
  } else {
    $('#control-panel').slideDown();
  }
  if (primaryView === 'request') {
    $('#map').removeClass('active');
    $('#request').addClass('active');
    $('#tab-col').removeClass('external');
    $('#tab-content').removeClass('external');
    return;
  } else {
    $('#tab-col').removeClass('external');
    $('#tab-content').removeClass('external');
  }
  if (primaryView === 'external') {
    showExternal(subView);
    $('#map').removeClass('active');
    $('#tab-col').addClass('external');
    $('#tab-content').addClass('external');
    return;
  } else {
    $('#tab-col').removeClass('external');
    $('#tab-content').removeClass('external');
  }
  if (primaryView === 'detail') {
     $('#locate').slideDown();
    $('#time-type').slideDown();
    $('#map-type').slideUp();
    $('#animate').slideUp();
    $('#state-filter').slideDown();
    noResults();
    return;
  }
  if (primaryView === 'map') {
    $('#locate').slideDown();
    $('#time-type').slideDown();
    $('#map-type').slideDown();
    $('#animate')[future || subView === 'state' ? 'slideUp' : 'slideDown']();
    $('#state-filter').slideUp();
    $('#map').addClass('active');
    $('#map-type label').removeClass('active');
    $(`#map-type label[for="${subView}-map"]`).addClass('active');
  }
  if (subView === 'state') {
    $('body').addClass('state');
    $('#past-sessions').trigger('click');
  } else {
    $('body').removeClass('state');
  }
}

function showView() {
  const view = getSelectedView();
  setControlPanelCss(view);
  if (view !== 'detail') {
    if (view === 'map:location') displayLocationMap();
    else if (view === 'map:state') displayStateMap();
  }
  if (view === 'external') showExternal(view);
}

function filterState(event) {
  const filter = $('#state');
  const state = filter.val();
  filter.find('option').each((i, option) => {
    $('location-list').removeClass(option.value);
  });
  $('#location-list .feature-html').each((i, html) => {
    $(html).removeClass('hide');
    if (state !== 'all') $(html).not(`.${state}`).addClass('hide');
  });
  filter[state === 'all' ? 'removeClass' : 'addClass']('active');
  noResults()
}

function noResults() {
  $('#locations .no-result').hide();
  if (!$('#location-list .feature-html').is(':visible')) {
    const state = $('#state').val();
    const message = $('#locations .no-result');
    message.find('.message').attr('data-i18n', getFuture() ? 'future.filter.none' : 'past.filter.none');
    message.find('.state').html($(`#state option[value="${state}"]`).html());
    message.localize().show();
  }
}

export function populateStateFilter() {
  const features = stateLayer.getSource().getFeatures()
  features.sort((f0, f1) => {
    const s0 = f0.get('name');
    const s1 = f1.get('name');
    if (s0 < s1) {
      return -1;
    } else if (s0 > s1) {
      return 1;
    }
    return 0;
  });
  features.forEach(feature => {
    $('#state').append(`<option value="${feature.getId()}">${feature.get('name')}</option>`)
  });
}

export default function createControlPanel() {
  $('#control-panel form').on('submit', event => event.preventDefault());
  $('#map-tab, #location-tab').on('click', showControlPanel);
  $('#control-panel form input[name="choice"]').on('change', showView);
  $('#show-view, #request-tab, #stats-tab, #stories-tab').on('click', showView);
  $('#animate').on('click', showView);
  $('#animate').on('click', animate);
  $('#state').on('change', filterState);
  createTrainingRequest();
}
