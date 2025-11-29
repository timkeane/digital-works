import Csv from './format/Csv';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import style from './style/location';
import blankStyle from './style/blank';
import html from '../feature/location';

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
  zIndex: 0
});

layer.set('name', 'location');
layer.set('featureHtml', html);
layer.set('blankStyle', blankStyle);
layer.set('pointStyle', style);

export default layer;
