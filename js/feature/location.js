import $ from 'jquery';
import {formatNumber} from '../util';

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
  const to = encodeURIComponent(feature.get('address'));
  const href = `https://www.google.com/maps/dir/${from}/${to}/`;
  const directions = $(`<a class="directions" href="${href}" rel="noopener" target="_blank" data-i18n="[aria-label]directions"></a>`);
  distance.append(directions);
}

function valueKey(value) {
  if (!value) return '';
  return value.replace(/\//g, '_').replace(/\-/g, '_').replace(/\(/g, '').replace(/\)/g, '').replace(/ /g, '_').toLowerCase()
}

export default function html(feature, type) {
  const locationHasFuture = feature.get('has-future') ? 'has-future' : 'no-future';
  const locationNoPast = !feature.get('has-past') ? 'no-past' : '';
  const grouped = feature.get('grouped');
  const html = $(`<div data-id="${feature.getId()}" class="feature-html location ${locationHasFuture} ${locationNoPast} ${feature.get('sessions')[0]['State']}">`);
  let orgIdx = 0;
  appendDistance(html, feature);
  Object.entries(grouped).forEach(sessionsByOrg => {
    const org = sessionsByOrg[0];
    const orgHasFuture = sessionsByOrg[1].hasFuture ? 'has-future' : 'no-future';
    const orgNoPast = !sessionsByOrg[1].hasPast ? 'no-past' : '';
    const sessions = sessionsByOrg[1].sessions;
    const peopleByOrg = sessionsByOrg[1].people;
    const orgKey = valueKey(sessionsByOrg[1].type);
    const orgHtml = $(`<div class="feature-org ${orgHasFuture} ${orgNoPast} org-${orgIdx}"><h4 role="button">${org}</h4><div class="address">${feature.get('formatted_address')}</div></div>`)
      .append(
        $('<div class="rollup"></div>')
          .append(orgKey ? `<div class="prop org-type"><span class="field" data-i18n="prop.name.organization_type"></span> <span class="value" data-i18n="type.value.${orgKey}"></span></div>` : '')
          .append(peopleByOrg ? `<div class="prop people"><span class="field" data-i18n="prop.name.total_trained"></span> <span class="value">${formatNumber(peopleByOrg)}</span></div>` : '')
        ).append('<h5 data-i18n="training.sessions"></h5>')
    const sessionsHtml = $('<div class="session-group"></div>');
    sessions.forEach((session, i) => {
      const future = session['future'] ? 'future' : '';
      const div = $(`<div data-id="${session.ID}" class="session session-${i} ${future}"></div>`);
      const projKey = valueKey(session['Project Type']);
      const topicKey = valueKey(session['Training Topic']);
      const people = session['Number Trained'];
      const date = session['Training Date'];
      const lang = session['Language']?.toLowerCase();
      div.append(date ? `<div class="prop"><span class="field" data-i18n="prop.name.training_date"></span> <span class="value">${date}</span></div>` : '')
        .append(people ? `<div class="prop people"><span class="field" data-i18n="prop.name.number_trained"></span> <span class="value">${formatNumber(people)}</span></div>` : '')
        .append('<br>')
        .append(projKey ? `<div class="prop"><span class="field" data-i18n="prop.name.project_type"></span> <span class="value" data-i18n="type.value.${projKey}"></span></div>` : '')
        .append(topicKey ? `<div class="prop"><span class="field" data-i18n="prop.name.training_topic"></span> <span class="value" data-i18n="type.value.${topicKey}"></span></div>` : '')
        .append(lang ? `<div class="prop"><span class="field" data-i18n="prop.name.lang"></span> <span class="value" data-i18n="type.value.${lang}"></span></div>` : '');
      orgHtml.append(sessionsHtml.append(div));
    });
    html.append(orgHtml);
    orgIdx = orgIdx + 1;
  });
  return html.localize();
}
