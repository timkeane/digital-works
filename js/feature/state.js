import $ from 'jquery';
import {formatNumber} from '../util';
import data from '../data/data';

export default function html(feature, type) {
  const state = feature.get('name');
  const people = data.headCount.state[feature.getId()] || 0;
  const html = $(`<div class="feature-html state"><h4>${state}</h4></div>`);
  html.append(`<div class="prop"><span class="field" data-i18n="prop.name.number_trained"></span> <span class="value">${formatNumber(people)}</span></div>`);
  return html.localize();
}