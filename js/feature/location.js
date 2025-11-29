import $ from 'jquery';
import {formatNumber} from '../util';

function getToAddress(session) {
  const addr = session['Address'];
  const city = session['City'];
  const state = session['State'];
  const zip = session['Zip Code'];
  return encodeURIComponent(`${addr},${city},${state} ${zip}`);
}

function appendDistance(html, feature) {
  const meters = feature.get('distance');
  const miles = meters / 1609.34;
  const mi = meters ? `${formatNumber(miles)} mi` : '';
  const distance = $(`<div class="distance">${mi}</div>`);
  if (miles < 200) appendDirections(distance, feature);
  html.append(distance);
}

function appendDirections(distance, feature) {
  const from = encodeURIComponent($('#search').val());
  const to = getToAddress(feature.get('sessions')[0]);
  const href = `https://www.google.com/maps/dir/${from}/${to}/`;
  const directions = $(`<a class="directions" href="${href}" rel="noopener" target="_blank" data-i18n="[aria-label]directions"></a>`);
  distance.append(directions);
}

function valueKey(value) {
  if (!value) return '';
  return value.replace(/\//g, '_').replace(/\-/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/ /g, '_').toLowerCase()
}

export function i18nAddress(session) {
  const addr = session['Address'];
  const city = session['City'];
  const state = session['State'];
  const zip = session['Zip Code'];
  if ($('html').attr('dir') === 'rtl') {
    return `${zip} ${state}, ${city}${addr ? '<br>' : ''}${addr}`;
  }
  return `${addr}${addr ? '<br>' : ''}${city}, ${state} ${zip}`;
}

export default function html(feature, type) {
  const hasFuture = feature.get('has-future') ? 'has-future' : 'no-future';
  const sessions = feature.get('sessions');
  const html = $(`<div class="feature-html location ${hasFuture}"><h4 role="button">${i18nAddress(sessions[0])}</h4></div>`);
  appendDistance(html, feature);
  sessions.forEach((session, i) => {
    const future = session['future'] ? 'future' : '';
    const css = `${i === 0 ? 'first' : 'more'} ${future}`;
    const div = $(`<div class="session ${type} ${css}"></div>`);
    const org = session['Organization'];
    const orgKey = valueKey(session['Organization Type']);
    const projKey = valueKey(session['Project Type']);
    const topicKey = valueKey(session['Training Topic']);
    const people = session['Number of People Trained'];
    const date = session['Training Date'];
    html.append(div);
    div.append(`<div><span class="field" data-i18n="[prepend]prop.name.organization">:</span> <span class="value">${org}</span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.organization_type">:</span> <span class="value" data-i18n="type.value.${orgKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.project_type">:</span> <span class="value" data-i18n="type.value.${projKey}"></span></div>`)
      .append(people ? `<div><span class="field" data-i18n="[prepend]prop.name.number_of_people_trained">:</span> <span class="value">${formatNumber(people)}</span></div>` : '')
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.training_topic">:</span> <span class="value" data-i18n="type.value.${topicKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.training_date">:</span> <span class="value">${date}</span></div>`);
  });
  return html.localize();
}