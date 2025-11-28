import Csv from './format/Csv';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import style from './style/location';
import blankStyle from './style/blank';
import html from '../feature/location';
import {getMap, getSelectedFeature, getView, store} from '../util';
import {listHighlight} from '../list/list';

const url = './data/location.csv';

const format = new Csv({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
  x: 'Longitude',
  y: 'Latitude' 
});

const source = new Source({format, url});

const layer = new Layer({
  source,
  style,
  minZoom: 0
});

layer.set('name', 'location');
layer.set('featureHtml', html);
layer.set('blankStyle', blankStyle);
layer.set('pointStyle', style);

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
  source.getFeatures().forEach(feature => feature.set('highlight', false));
  store('selectedFeature', feature);
  listHighlight();
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

export default layer;
