import Layer from 'ol/layer/Vector';
import style from './style/location';
import blankStyle from './style/blank';
import html from '../feature/location';
import data from '../data/data';
import {updateLocationList} from '../list/list';
import {forMobile} from '../html/resize';
import {updateLegend} from '../control/legend';
import {store} from '../util';

data.source.on('featuresloadend', updateLocationList);
data.source.on('featuresloadend', forMobile);
data.source.on('featuresloadend', updateLegend);

const layer = new Layer({
  source: data.source,
  style,
  zIndex: 0
});

layer.set('name', 'location');
layer.set('featureHtml', html);
layer.set('blankStyle', blankStyle);
layer.set('pointStyle', style);

store('locationLayer', layer);

export default layer;
