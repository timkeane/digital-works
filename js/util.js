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
  return storage.locationLayer;
}

export function getLocationSource() {
  return getLocationLayer().getSource();
}

export function getStateLayer() {
  return storage.stateLayer;
}

export function getStateName(id) {
  return getStateLayer().getSource().getFeatureById(id).get('name');
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

export function getBorderStyle() {
  return storage.borderStyle;
}

export function setFuture(future) {
  storage.future = future;
}

export function getFuture() {
  return storage.future;
}