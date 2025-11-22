import $ from 'jquery';
import {getCurrentLanguage} from './i18n/i18n';

const env = import.meta.env;
const storage = {data: []};
const svg = {
  secondary: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle fill="rgba(0,0,0,.3)" stroke="rgba(0,0,0,.3)" stroke-width="3" cx="24" cy="24" r="19"/><circle fill="rgba(0,0,0,0)" stroke="#fff" stroke-width="3" cx="24" cy="24" r="16"/><path fill="#fff" transform="translate(12, 12)" d="M6.043 19.496l-1.482 1.505c-2.791-2.201-4.561-5.413-4.561-9.001s1.77-6.8 4.561-9l1.482 1.504c-2.326 1.835-3.804 4.512-3.804 7.496s1.478 5.661 3.804 7.496zm.675-7.496c0-1.791.887-3.397 2.282-4.498l-1.481-1.502c-1.86 1.467-3.04 3.608-3.04 6s1.18 4.533 3.04 6l1.481-1.502c-1.396-1.101-2.282-2.707-2.282-4.498zm15.043 0c0-2.984-1.478-5.661-3.804-7.496l1.482-1.504c2.791 2.2 4.561 5.412 4.561 9s-1.77 6.8-4.561 9.001l-1.482-1.505c2.326-1.835 3.804-4.512 3.804-7.496zm-6.761 4.498l1.481 1.502c1.86-1.467 3.04-3.608 3.04-6s-1.18-4.533-3.04-6l-1.481 1.502c1.396 1.101 2.282 2.707 2.282 4.498s-.886 3.397-2.282 4.498zm-3-7.498c-1.656 0-3 1.343-3 3s1.344 3 3 3 3-1.343 3-3-1.344-3-3-3z"/></svg>',
  challenge: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle fill="" stroke="#000" stroke-width="3" cx="24" cy="24" r="19"/><circle fill="#111a52" stroke="#fff" stroke-width="3" cx="24" cy="24" r="16"/><path fill="#fff" transform="translate(12, 12)" d="M6.043 19.496l-1.482 1.505c-2.791-2.201-4.561-5.413-4.561-9.001s1.77-6.8 4.561-9l1.482 1.504c-2.326 1.835-3.804 4.512-3.804 7.496s1.478 5.661 3.804 7.496zm.675-7.496c0-1.791.887-3.397 2.282-4.498l-1.481-1.502c-1.86 1.467-3.04 3.608-3.04 6s1.18 4.533 3.04 6l1.481-1.502c-1.396-1.101-2.282-2.707-2.282-4.498zm15.043 0c0-2.984-1.478-5.661-3.804-7.496l1.482-1.504c2.791 2.2 4.561 5.412 4.561 9s-1.77 6.8-4.561 9.001l-1.482-1.505c2.326-1.835 3.804-4.512 3.804-7.496zm-6.761 4.498l1.481 1.502c1.86-1.467 3.04-3.608 3.04-6s-1.18-4.533-3.04-6l-1.481 1.502c1.396 1.101 2.282 2.707 2.282 4.498s-.886 3.397-2.282 4.498zm-3-7.498c-1.656 0-3 1.343-3 3s1.344 3 3 3 3-1.343 3-3-1.344-3-3-3z"/></svg>',
  primary: '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><circle fill="" stroke="#000" stroke-width="3" cx="24" cy="24" r="19"/><circle fill="#008450" stroke="#fff" stroke-width="3" cx="24" cy="24" r="16"/><path fill="#fff" transform="translate(12, 12)" d="M0 7.244c3.071-3.24 7.314-5.244 12-5.244 4.687 0 8.929 2.004 12 5.244l-2.039 2.15c-2.549-2.688-6.071-4.352-9.961-4.352s-7.412 1.664-9.961 4.352l-2.039-2.15zm5.72 6.034c1.607-1.696 3.827-2.744 6.28-2.744s4.673 1.048 6.28 2.744l2.093-2.208c-2.143-2.261-5.103-3.659-8.373-3.659s-6.23 1.398-8.373 3.659l2.093 2.208zm3.658 3.859c.671-.708 1.598-1.145 2.622-1.145 1.023 0 1.951.437 2.622 1.145l2.057-2.17c-1.197-1.263-2.851-2.044-4.678-2.044s-3.481.782-4.678 2.044l2.055 2.17zm2.622 1.017c-1.062 0-1.923.861-1.923 1.923s.861 1.923 1.923 1.923 1.923-.861 1.923-1.923-.861-1.923-1.923-1.923z"/></svg>',
};

const numberFormat = new Intl.NumberFormat(getCurrentLanguage(), {maximumFractionDigits: 1});

window.storage=storage;

export function getSelectedFeature() {
  return storage.selectedFeature;
}

export function store(prop, obj) {
  storage[prop] = obj;
}

export function getMap() {
  return storage.map;
}

export function getView() {
  return getMap().getView();
}

export function getLocationLayer() {
  return getMap().get('location');
}

export function getStateLayer() {
  return getMap().get('state');
}

export function getBgLayer() {
  return getMap().get('bg');
}

export function getPopupOverlay() {
  return getMap().get('popupOverlay');
}

export function getLocationOverlay() {
  return getMap().get('locationOverlay');
}

export function getLocation() {
  return getLocationOverlay()?.getPosition();
}

export function getAppPath() {
  return env.VITE_APP_PATH;
}

export function getChallengeFill() {
  return env.VITE_CHALLENGE_FILL;
}

export function getChallengeStroke() {
  return env.VITE_CHALLENGE_STROKE;
}

export function getSelectFill() {
  return env.VITE_SELECT_FILL;
}

export function getSelectStroke() {
  return env.VITE_SELECT_STROKE;
}

export function getDrawFill() {
  return env.VITE_DRAW_FILL;
}

export function getDrawStroke() {
  return env.VITE_DRAW_STROKE;
}

export function getBgFill() {
  return env.VITE_BG_FILL;
}

export function getBgStroke() {
  return env.VITE_BG_STROKE;
}

export function getBoundaryStroke() {
  return env.VITE_BOUNDARY_STROKE;
}

export function isChallenge(feature) {
  return getChallengeSource().getFeatureById(feature.getId()) !== null || feature.get('challenge');
}

export function getIconDataUri(value) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg[value])}`;
}

export function getParameterizedtUrl(url, extent, where) {
  where = where || '1 = 1';
  const whereParam = encodeURIComponent(where);
  const extentParam = `{"xmin":${extent[0]},"ymin":${extent[1]},"xmax":${extent[2]},"ymax":${extent[3]},"spatialReference":{"wkid":102100,"latestWkid":3857}}`;
  return `${url}&esriSpatialRelIntersects&geometry=${encodeURIComponent(extentParam)}&where=${whereParam}`;
}

export function getChallengeTabButton() {
  return $(`#${storage.challengeTab.attr('aria-labelledby')}`);
}

export function getTranslate() {
  return storage.translate;
}

export function formatNumber(number) {
  return numberFormat.format(number);
}

export function setData(event) {
  storage.headCountByLocation = {};
  event.features.forEach(feature => {
    const sessions = feature.get('data');
    let people = 0;
    sessions.forEach(session => {
      people += (session['Number of People Trained'] * 1);
    });
    feature.set('people', people);
    storage.headCountByLocation[feature.getId()] = people;
    storage.data = storage.data.concat(sessions);
  });
  
  const prop = 'State';
  const data = getData();
  const states = {};
  data.forEach(session => {
    if (session[prop]) {
      let number = session['Number of People Trained'];
      number = number?.trim() ? parseInt(number) : 0;
      states[session[prop]] = states[session[prop]] || 0;
      states[session[prop]] = states[session[prop]] + number;
    }
  });
  storage.headCountByState = states;
}

export function getData() {
  return storage.data;
}

export function getHeadCountByLocation() {
  return storage.headCountByLocation;
}

export function getHeadCountByState(feature) {
  if (feature) {
    return storage.headCountByState[feature.getId()];
  }
  return storage.headCountByState;
}

export function getBorderStyle() {
  return storage.borderStyle;
}

