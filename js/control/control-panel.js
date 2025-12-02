import $ from 'jquery';
import {getBorderStyle, getStateLayer, getLocationLayer, setFuture, formatNumber} from '../util';
import {renderChart} from './chart';
import countStyle from '../layer/style/state';
import {updateLegend} from './legend';
import animate from '../layer/animate';

const storyUrl = 'https://storymaps.arcgis.com/stories/c222fb7619ea49c5a4db939b77dee4e5';
const statsUrl = 'https://app.powerbi.com/view?r=eyJrIjoiMTMyZmRhNzMtNWY5NC00OTlmLTgxNjEtZjA1OTFlNWIxZTE2IiwidCI6IjVhMjNkMTNlLTBhM2UtNDI5MS04ZDMzLTM5N2Y2YTEwZjEwYiJ9';

function setTime(event) {
  const target = $(event.target);
  const future = $('#future-radio').is(':checked');
  const layer = getLocationLayer();
  const style = layer.getStyle();
  setFuture(future);
  $('body')[future ? 'addClass' : 'removeClass']('future');
  $('#time-frame label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  layer.setStyle(layer.get('blankStyle'));
  layer.setStyle(style); 
  updateLegend();
}

function setView(event) {
  const target = $(event.target);
  const view = target.val();
  const type = $('#map-state-radio').is(':checked') ? 'state' : 'location';
  $('#locate')[type === 'state' ? 'slideUp' : 'slideDown']();
  $('#view-type label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  $('#show-view').removeClass('detail').removeClass('map').removeClass('chart').addClass(view);
  if (view === 'map') {
    $('#show-view').attr('data-i18n', 'control.panel.show;[aria-label]control.panel.show_map;[title]control.panel.show_map').localize();
    $('#map-type').slideDown();
    $('#chart-type').slideUp();
    $('#chart').removeClass('active').attr('aria-hidden', true);
    $('#map').addClass('active').attr('aria-hidden', false);
  } else {
    $('#show-view').attr('data-i18n', 'control.panel.show;[aria-label]control.panel.show_chart;[title]control.panel.show_chart').localize();
    $('#map-type').slideUp();
    $('#chart-type').slideDown();
    $('#map').removeClass('active').attr('aria-hidden', true);
    $('#chart').addClass('active').attr('aria-hidden', false);
    setChart({target: $('#chart-type input:checked').get(0)});
  }
}

function setMap(event) {
  const target = $(event.target);
  const type = target.val();
  $('#map-type label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  getLocationLayer().setVisible(type === 'location');
  getStateLayer().setStyle(type === 'state' ? countStyle : getBorderStyle());
  $('#animate')[type === 'location' ? 'slideDown' : 'slideUp']();
  $('#time-frame')[type === 'location' ? 'slideDown' : 'slideUp']();
  $('#locate')[type === 'location' ? 'slideDown' : 'slideUp']();
}

function setChart(event) {
  const target = $(event.target);
  $('#chart-type label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  renderChart(target.val());
}

function showView(event) {
  event.preventDefault();
  let view = $('#view-type input:checked').val();
  if ($('#show-view').hasClass('detail')) view = 'detail';
  $('#map')[view === 'map' ? 'addClass' : 'removeClass']('active');
  $('#control-panel').slideUp();
  $(`#${view}`).slideDown();
}

function showControlPanel(event) {
  event.preventDefault();
  const view = $('#location-tab').hasClass('active') ? 'locations' : $('#view-type input:checked').val();
  if ($(window).width() < 575) {
    $('#show-view').removeClass('detail').removeClass('map').removeClass('chart').addClass(view);
    $(`#${view}`).slideUp();
    $(view === 'map' ? '#chart-type' : '#map-type').slideUp();
    $('#control-panel').slideDown();
  } else {
    const type = $('#map-state-radio').is(':checked') ? 'state' : 'location';
    $('#time-frame')[type === 'state' ? 'slideUp' : 'slideDown']();
    $('#view-type input:checked').trigger('change');
  }
}

function showStories(event) {
  event.preventDefault();
  const stories = $('#stories-tab').hasClass('active');
  const stats = $('#stats-tab').hasClass('active');
  const external = stories || stats;
  $('#external').attr('src', stories ? storyUrl : statsUrl);
  $('#control-panel')[external ? 'slideUp' : 'slideDown']();
  $('#tab-col')[external ? 'addClass' : 'removeClass']('external');
  $('#tab-content')[external ? 'addClass' : 'removeClass']('external');
}

function showAnimation(event) {
  event.preventDefault();
  animate();
  if ($(window).width() < 575) $('#show-view').trigger('click');
}

export default function createControlPanel() {
  $('#time-frame input').on('change', setTime);
  $('#view-type input').on('change', setView);
  $('#map-type input').on('change', setMap);
  $('#chart-type input').on('change', setChart);
  $('#show-view').on('click', showView);
  $('#map-tab').on('click', showControlPanel);
  $('.nav button').on('click', showStories);
  $('#animate').on('click', showAnimation);
  $('#location-tab').on('click', () => {
    $('#show-view').attr('data-i18n', 'control.panel.show;[aria-label]tab.details.show;[title]tab.details.show').localize();
    $('#show-view').removeClass('map').removeClass('chart').addClass('detail');
    $('#locate').slideDown();
    $('#time-frame').slideDown();
  });
  $('#nav button').on('click', event => {
    if (event.target.id === 'location-tab') {
      $('#locate').slideDown();  
    }
  });
}
