import Csv from './format/Csv';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import style from './style/training';
import html from '../feature/html';
import {getMap, getSelectedFeature, getView, store} from '../util';
import {listHighlight} from '../list/list';

const url = './data/training.csv';

const format = new Csv({
  dataProjection: 'EPSG:4326',
  featureProjection: 'EPSG:3857',
  idPrefix: 'training-',
  idProp: 'ID',
  x: 'Longitude',
  y: 'Latitude' 
});

const source = new Source({format, url});

const layer = new Layer({
  source,
  style,
  minZoom: 0
});

layer.set('name', 'training');
layer.set('featureHtml', html);

function layerFilter(layer) {
  return layer.get('name') === 'training';
}

function getFeature(eventOrFeature) {
  if (eventOrFeature.pixel) {
    return getMap().getFeaturesAtPixel(eventOrFeature.pixel, {hitTolerance: 20, layerFilter})[0];
  }
  return eventOrFeature;
}

export function highlight(eventOrFeature) {
  console.warn(eventOrFeature.coordinate);
  
  const feature = getFeature(eventOrFeature);
  console.warn(feature);
  
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
