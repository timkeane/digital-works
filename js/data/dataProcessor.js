import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import data from './data';

const today = (new Date()).toISOString().split('T')[0];
const source = data.source;
const months = {};

function sortSessions(feature) {
  const sessions = feature.get('sessions');
  sessions.sort((s0, s1) => {
      const date0 = s0['Training Date'];
      const date1 = s1['Training Date'];
      if (date1 < date0) {
        return -1;
      } else if (date1 > date0) {
        return 1;
      }
      return 0
    });
  feature.set('sessions', sessions);
}

export function getAddress(session) {
  const addr = session['Address'];
  const city = session['City'];
  const state = session['State'];
  const zip = session['Zip Code'];
  return `${addr},${city},${state} ${zip}`;
}

export function getDisplayAddress(session) {
  const addr = session['Address'];
  const city = session['City'];
  const state = session['State'];
  const zip = session['Zip Code'];
  return `${addr}${addr ? '<br>' : ''}${city}, ${state} ${zip}`;
}

function pad(num) {
  return num.length === 1 ? `0${num}` : num;
}

function getMonth(date) {
  if (date?.length >= 10) {
    return date.substring(0, date.lastIndexOf('-'));
  }
}

function setPastMonths() {
  const pastMonths = Object.values(months).sort((m0, m1) => {
    if (m0 < m1) {
      return -1;
    } else if (m0 > m1) {
      return 1;
    }
    return 0;
  });
  data.pastMonths = pastMonths;
}

function getIsoDate(dateString) {
  if (dateString?.length) {
    if (dateString.indexOf('/') > 0) {
      const dateParts = dateString.split('/');
      return `${dateParts[2]}-${pad(dateParts[0])}-${pad(dateParts[1])}`;
    } else if (dateString.indexOf('-') === 4) {
      return dateString;
    }
  }
 return '';
}

function addToPastMonths(month, session) {
  const thisMonth = getMonth(today);
  const people = session['Number Trained'];
  if (!isCommunityPlanning(session) && people > 0) {
    if (month < thisMonth || month === thisMonth) months[month] = month;
  }
}

function manageTrainingDate(feature, session) {
  const date = getIsoDate(session['Training Date']);
  const future = isFuture(session);
  const month = getMonth(date);
  session['Training Date'] = date;
  session['Year of Engagement'] = date.split('-')[0];
  session.future = future;
  session.month = month;
  addToPastMonths(month, session);
  if (future) feature.set('has-future', true);
  if (!future) feature.set('has-past', true);
}

function getPeople(session) {
  const people = session['Number Trained'];
  return people?.trim() ? parseInt(people) : 0;
}

function getLocationId(session) {
  return `${session.Longitude || '0'}@${session.Latitude || '0'}`;
}

function addSessionToFeatures(session) {
  const locId = getLocationId(session);
  let feature = source.getFeatureById(locId);
  if (!feature) {
    const x = parseFloat(session.Longitude || '0');
    const y = parseFloat(session.Latitude || '0');
    const point = new Point([x, y]).transform('EPSG:4326', 'EPSG:3857');
    feature = new Feature(point);
    feature.setId(locId);
    feature.set('sessions', []);
    feature.set('people', 0);
    feature.set('formatted_address', getDisplayAddress(session));
    feature.set('address', getAddress(session));
    feature.set('has-future', false);
    feature.set('has-past', false);
    feature.set('only-community-planning', true);
    source.addFeature(feature);
  }
  const sessions = feature.get('sessions');
  sessions.push(session);
  feature.set('sessions', sessions);
  feature.set('people', feature.get('people') + getPeople(session));
  if (!isCommunityPlanning(session))
    feature.set('only-community-planning', false);
  manageTrainingDate(feature, session);
}

function sessions(rows) {
  const location = data.headCount.location;
  const state = data.headCount.state;
  data.sessions = rows;
  rows.forEach(session => {
    if (validSession(session)) {
      const locId = getLocationId(session);
      const people = getPeople(session);
      addSessionToFeatures(session);
      location[locId] = location[locId] || 0;
      location[locId] = location[locId] + people;
      state[session.State] = state[session.State] || 0;
      state[session.State] = state[session.State] + people;
    }
  });
  source.getFeatures().forEach(feature => sortSessions(feature));
  setPastMonths();
}

export function isFuture(session) {
  return today < getIsoDate(session['Training Date']);
}

export function isCommunityPlanning(session) {
  return session['Project Type'] === 'Community Planning';
}

export function hasPeople(session) {
  const people = parseInt(session['Number Trained']);
  return people && !isNaN(people) && people > 0;
}

export function validSession(session) {
  const type = session['Project Type'];
  // const valid = isFuture(session) || (type?.trim().length > 0 && (isCommunityPlanning(session) || hasPeople(session)));
  const valid = isFuture(session) || (isCommunityPlanning(session) || hasPeople(session));
  if (valid) return true;
  console.error('Bad row:', session);
}

export function processData(response) {
  if (response.errors?.length) {
    console.error('Papaparse errors:', response.errors);
  }
  sessions(response.data);
  source.dispatchEvent('featuresloadend');
}
