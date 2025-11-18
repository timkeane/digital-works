import $ from 'jquery';
import {getStateLayer, getTrainingLayer} from '../util';
import { renderChart } from './chart';

function setTime(event) {
  const target = $(event.target);
  $('#time-frame input').parent().removeClass('active');
  target.parent().addClass('active');

}

function setView(event) {
  const target = $(event.target);
  $('#view-type input').parent().removeClass('active');
  target.parent().addClass('active');
  if (target.val() === 'map') {
    $('#map-type').slideDown();
    $('#chart-type').slideUp();
    $('#chart').removeClass('active').attr('aria-hidden', true);
    $('#map').addClass('active')
      .attr('aria-hidden', false)

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
  $('#map-type input').parent().removeClass('active');
    target.parent().addClass('active');
    getTrainingLayer().setVisible(target.val() === 'location');
    getStateLayer().setVisible(target.val() === 'state');

}

function setChart(event) {
  const target = $(event.target);
  $('#chart-type input').parent().removeClass('active');
  target.parent().addClass('active');
  renderChart(target.val());
}

export default function createControlPanel() {
  $('#time-frame input').on('change', setTime);
  $('#view-type input').on('change', setView);
  $('#map-type input').on('change', setMap);
  $('#chart-type input').on('change', setChart);

}