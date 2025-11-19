import $ from 'jquery';
import {getBorderStyle, getStateLayer, getTrainingLayer} from '../util';
import {renderChart} from './chart';
import countStyle from '../layer/style/state';

function setTime(event) {
  const target = $(event.target);
  $('#time-frame label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');

}

function setView(event) {
  const target = $(event.target);
  $('#view-type label').removeClass('active');
  $(`label[for=${target.attr('id')}]`).addClass('active');
  if (target.val() === 'map') {
    $('#map-type').slideDown();
    $('#chart-type').slideUp();
    $('#chart').removeClass('active').attr('aria-hidden', true);
    $('#map').addClass('active')
      .attr('aria-hidden', false);
  } else {
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
  const view = $('#view-type input:checked').val();
  $('#control-panel').slideUp();
  $(`#${view}`).slideDown();
}

function showControlPanel(event) {
  event.preventDefault();
  if ($(window).width() < 575) {
    const view = $('#location-tab').hasClass('active') ? 'locations' : $('#view-type input:checked').val();
    $(`#${view}`).slideUp();
    $('#control-panel').slideDown();
  }
}

function showStories(event) {
  event.preventDefault();
  const stories = $('#stories-tab').hasClass('active');
  $('#control-panel')[stories ? 'slideUp' : 'slideDown']();
  $('#tab-col')[stories ? 'addClass' : 'removeClass']('stories');
}

export default function createControlPanel() {
  $('#time-frame input').on('change', setTime);
  $('#view-type input').on('change', setView);
  $('#map-type input').on('change', setMap);
  $('#chart-type input').on('change', setChart);
  $('#show-view').on('click', showView);
  $('#map-tab').on('click', showControlPanel);
  $('.nav button').on('click', showStories)
}