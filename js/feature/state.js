import $ from 'jquery';
import { getTrainingByState } from '../util';

export default function html(feature, type) {
  console.warn(feature.getProperties());
  
  const state = feature.get('name');
  const html = $(`<div class="feature-html"><h4>${state}</h4></div>`);
  html.append(`<div><span class="field">Number of people trained:</span> <span class="value">${getTrainingByState(feature)}</span></div>`);
  return html;
}