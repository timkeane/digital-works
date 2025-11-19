import $ from 'jquery';
import {formatNumber, getTrainingByState} from '../util';

export default function html(feature, type) {
  const state = feature.get('name');
  const people = getTrainingByState(feature);
  const html = $(`<div class="feature-html state"><h4>${state}</h4></div>`);
  html.append(`<div class="detail"><span class="field">Number of people trained:</span> <span class="value">${formatNumber(people)}</span></div>`);
  return html;
}