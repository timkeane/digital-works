import $ from 'jquery';
import {formatNumber} from '../util';

const displayProps = [
  'Organization',
  'Organization Type',
  'Project Type',
  'Number of People Trained',
  'Year of Engagement'
];

function i18nAddress(session) {
  const addr = session['Address'];
  const city = session['City'];
  const state = session['State'];
  const zip = session['Zip Code'];
  if ($('html').attr('dir') === 'rtl') {
    return `${zip} ${state}, ${city}<br>${addr}`;
  }
  return `${addr}<br>${city}, ${state} ${zip}`;
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
    const div = $(`<div class="session ${css}"></div>`);
    appendDistance(html, feature);
    html.append(div);
    displayProps.forEach(prop => {
      const value = session[prop];
      if (value && value.trim()) {
        if (prop.indexOf('Type') > -1) {
          const lngKey = session[prop].replace(/\//g, '_').replace(/\-/g, '_').replace(/ /g, '_').toLowerCase();
          div.append(`<div><span class="field">${prop}:</span> <span class="value" data-i18n="type.value.${lngKey}"></span></div>`);
        } else {
          div.append(`<div><span class="field">${prop}:</span> <span class="value">${value}</span></div>`);
        }
      }
    });
  });
  return html.localize();
}