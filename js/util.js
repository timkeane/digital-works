import {getCurrentLanguage} from './i18n/i18n';

const env = import.meta.env;
const storage = {
  future: false,
  headCount: {
    state: {},
    location: {}
  }
};

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

export function getLocationSource() {
  return getLocationLayer().getSource();
}

export function getStateLayer() {
  return getMap().get('state');
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

export function formatNumber(number) {
  const numberFormat = new Intl.NumberFormat(getCurrentLanguage(), {maximumFractionDigits: 1});
  return numberFormat.format(number);
}

export function getHeadCount() {
  return storage.headCount;
}

export function setHeadCount(headCount) {
  return storage.headCount = headCount;
}

export function getHeadCountByLocation() {
  return storage.headCount.location;
}

export function getHeadCountByState(feature) {
  if (feature) {
    return storage.headCount.state[feature.getId()];
  }
  return storage.headCount.state;
}

export function getBorderStyle() {
  return storage.borderStyle;
}

export function setFuture(future) {
  storage.future = future;
}

export function getFuture() {
  return storage.future;
}