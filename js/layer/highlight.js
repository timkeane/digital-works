import {getMap, store, getSelectedFeature, getView, getLocationSource} from '../util';

function layerFilter(layer) {
  return layer.get('name') === 'location';
}

function getFeature(eventOrFeature) {
  if (eventOrFeature.pixel) {
    return getMap().getFeaturesAtPixel(eventOrFeature.pixel, {hitTolerance: 20, layerFilter})[0];
  }
  return eventOrFeature;
}

export function highlight(eventOrFeature) {
  const feature = getFeature(eventOrFeature);
  getLocationSource().getFeatures().forEach(feature => feature.set('highlight', false));
  store('selectedFeature', feature);
  if (feature) {
    feature.set('highlight', true);
  }
}

export function zoomToFeature() {
  const feature = getSelectedFeature();
  if (feature?.get('highlight')) {
    getView().animate({center: feature.getGeometry().getCoordinates(), zoom: 10});
  }
}
