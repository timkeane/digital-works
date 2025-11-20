import $ from 'jquery';
import {getBorderStyle, getStateLayer, getTrainingLayer} from '../util';
import {renderChart} from './chart';
import countStyle from '../layer/style/state';

const storyUrl = 'https://storymaps.arcgis.com/stories/c222fb7619ea49c5a4db939b77dee4e5';
const statsUrl = 'https://app.powerbi.com/view?r=eyJrIjoiMTMyZmRhNzMtNWY5NC00OTlmLTgxNjEtZjA1OTFlNWIxZTE2IiwidCI6IjVhMjNkMTNlLTBhM2UtNDI5MS04ZDMzLTM5N2Y2YTEwZjEwYiJ9';

function setTime(event) {
  const target = $(event.target);
  $('#time-frame label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');

}

function setView(event) {
  const target = $(event.target);
  const view = target.val();
  $('#view-type label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  $('#show-view').removeClass('detail').removeClass('map').removeClass('chart').addClass(view);
  if (view === 'map') {
    $('#show-view').attr('aria-label', 'Show map').attr('title', 'Show map');
    $('#map-type').slideDown();
    $('#chart-type').slideUp();
    $('#chart').removeClass('active').attr('aria-hidden', true);
    $('#map').addClass('active')
      .attr('aria-hidden', false);
  } else {
    $('#show-view').attr('aria-label', 'Show chart').attr('title', 'Show chart');
    $('#map-type').slideUp();
    $('#chart-type').slideDown();
    $('#map').removeClass('active').attr('aria-hidden', true);
    $('#chart').addClass('active')
      .attr('aria-hidden', false);
    setChart({target: $('#chart-type input:checked').get(0)});
  }
  
}

function setMap(event) {
  const target = $(event.target);
  $('#map-type label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  getTrainingLayer().setVisible(target.val() === 'location');
  getStateLayer().setStyle(target.val() === 'state' ? countStyle : getBorderStyle());
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
  if ($(window).width() < 575) {
    const view = $('#location-tab').hasClass('active') ? 'locations' : $('#view-type input:checked').val();
    $('#show-view').removeClass('detail').removeClass('map').removeClass('chart').addClass(view);
    $(`#${view}`).slideUp();
    $(view === 'map' ? '#chart-type' : '#map-type').hide();
    $('#control-panel').slideDown();
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

export default function createControlPanel() {
  $('#time-frame input').on('change', setTime);
  $('#view-type input').on('change', setView);
  $('#map-type input').on('change', setMap);
  $('#chart-type input').on('change', setChart);
  $('#show-view').on('click', showView);
  $('#map-tab').on('click', showControlPanel);
  $('.nav button').on('click', showStories);
  $('#location-tab').on('click', () => {
    $('#show-view').attr('aria-label', 'Show details').attr('title', 'Show details');
    $('#show-view').removeClass('map').removeClass('chart').addClass('detail')
  });
}