import $ from 'jquery';
import {formatNumber} from '../util';
import { getCurrentLanguage } from '../i18n/i18n';

function i18nAddress(session) {
  const addr = session['Address'];
  const city = session['City'];
  const state = session['State'];
  const zip = session['Zip Code'];
  if ($('html').attr('dir') === 'rtl') {
    return `${zip} ${state}, ${city}${addr ? '<br>' : ''}${addr}`;
  }
  return `${addr}${addr ? '<br>' : ''}${city}, ${state} ${zip}`;
}

function appendDistance(html, feature) {
  const meters = feature.get('distance');
  if (meters !== undefined) {
    const miles = formatNumber(meters / 1609.34);
    html.append(`<div class="distance">${miles} mi</div>`);
  }
}

function valueKey(value) {
  if (!value) return '';
  return value.replace(/\//g, '_').replace(/\-/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/ /g, '_').toLowerCase()
}

export default function html(feature, type) {
  const hasFuture = feature.get('has-future') ? 'has-future' : 'no-future';
  const sessions = feature.get('data');
  const html = $(`<div class="feature-html location ${hasFuture}"><h4>${i18nAddress(sessions[0])}</h4></div>`);
  sessions.forEach((session, i) => {
    const future = session['future'] ? 'future' : '';
    const css = `${i === 0 ? 'first' : 'more'} ${future}`;
    const div = $(`<div class="session ${type} ${css}"></div>`);
    const org = session['Organization'];
    const orgKey = valueKey(session['Organization Type']);
    const projKey = valueKey(session['Project Type']);
    const topicKey = valueKey(session['Training Topic']);
    const people = formatNumber(session['Number of People Trained']);
    const date = session['Training Date'];
    appendDistance(html, feature);
    html.append(div);
    div.append(`<div><span class="field" data-i18n="[prepend]prop.name.organization">:</span> <span class="value">${org}</span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.organization_type">:</span> <span class="value" data-i18n="type.value.${orgKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.project_type">:</span> <span class="value" data-i18n="type.value.${projKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.number_of_people_trained">:</span> <span class="value">${people}</span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.training_topic">:</span> <span class="value" data-i18n="type.value.${topicKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.training_date">:</span> <span class="value">${date}</span></div>`);
  });
  return html.localize();
}