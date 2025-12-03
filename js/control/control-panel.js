import $ from 'jquery';
import {getBorderStyle, getStateLayer, getLocationLayer, setFuture, getFuture} from '../util';
import countStyle from '../layer/style/state';
import {updateLegend} from './legend';
import animate from '../layer/animate';

const storyUrl = import.meta.env.VITE_STORIES_URL;
const statsUrl = import.meta.env.VITE_STATS_URL;

const timeForm = $('#time-type').get(0);
const mapForm = $('#map-type').get(0);
const locationLayer = getLocationLayer();
const stateLayer = getStateLayer();

function showControlPanel(event) {
  if ($(window).width() < 575) {
    $('#control-panel').slideDown();
  }
}

function showExternal(view) {
  const type = view.split(':')[0];
  $('#external').attr('src', type === 'stories' ? storyUrl : statsUrl);
}

function showAnimation(event) {
  animate();
  if ($(window).width() < 575) $('#show-view').trigger('click');
}

function getSelectedView() {
  const future = timeForm.choice.value === 'future';
  setFuture(future);
  if ($('#location-tab').hasClass('active')) return `detail${future ? ':future' : ''}`;
  if ($('#stats-tab').hasClass('active')) return 'external:stats';
  if ($('#stories-tab').hasClass('active')) return 'external:stories';
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
  if (primaryView === 'external') {
    showExternal(subView);
    $('#map').removeClass('active');
    $('#control-panel').slideUp();
    $('#tab-col').addClass('external');
    $('#tab-content').addClass('external');
  } else {
    $('#control-panel').slideDown();
    $('#tab-col').removeClass('external');
    $('#tab-content').removeClass('external');
  }
  if (primaryView === 'detail') {
    $('#locate').slideDown();
    $('#time-type').slideDown();
    $('#map-type').slideUp();
    $('#animate').slideUp();
    return;
  }
  if (primaryView === 'map') {
    $('#locate').slideDown();
    $('#time-type').slideDown();
    $('#map-type').slideDown();
    $('#animate')[future || subView === 'state' ? 'slideUp' : 'slideDown']();
    $('#map').addClass('active');
    $('#map-type label').removeClass('active');
    $(`#map-type label[for="${subView}-map"]`).addClass('active');
  }
}

function showView() {
  const view = getSelectedView();
  setControlPanelCss(view);
  if (view !== 'detail') {
    const viewParts = view.split(':');
    if (view === 'map:location') displayLocationMap();
    else if (view === 'map:state') displayStateMap();
  }
  if (view === 'external') showExternal(view);
}

export default function createControlPanel() {
  $('#control-panel form input[name="choice"]').on('change', showView);
  $('#nav button.nav-link').on('click', showView);
  $('#map-tab').on('click', showControlPanel);
  $('#control-panel form').on('submit', event => event.preventDefault());
  $('#animate').on('click', animate);
}


