import $ from 'jquery';
import {formatNumber} from '../util';

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

export default function html(feature, type) {
  const sessions = feature.get('data');
  const html = $(`<div class="feature-html location"><h4>${i18nAddress(sessions[0])}</h4></div>`);
  sessions.forEach((session, i) => {
    const css = i === 0 ? 'first' : 'more';
    const div = $(`<div class="session ${type} ${css}"></div>`);
    const org = session['Organization'];
    const orgKey = session['Organization Type'].replace(/\//g, '_').replace(/\-/g, '_').replace(/ /g, '_').toLowerCase();
    const projKey = session['Project Type'].replace(/\//g, '_').replace(/\-/g, '_').replace(/ /g, '_').toLowerCase();
    const people = formatNumber(session['Number of People Trained']);
    const year = session['Year of Engagement'];
    appendDistance(html, feature);
    html.append(div);
    div.append(`<div><span class="field" data-i18n="[prepend]prop.name.organization">:</span> <span class="value">${org}</span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.organization_type">:</span> <span class="value" data-i18n="type.value.${orgKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.project_type">:</span> <span class="value" data-i18n="type.value.${projKey}"></span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.number_of_people_trained">:</span> <span class="value">${people}</span></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.year_of_engagement">:</span> <span class="value">${year}</span></div>`);
  });
  return html.localize();
}