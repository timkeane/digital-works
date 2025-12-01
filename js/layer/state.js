import GeoJSON from 'ol/format/GeoJSON';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import html from '../feature/state';
import {Stroke, Style} from 'ol/style';
import {store} from '../util';

const url = './data/state.json';

const source = new Source({format: new GeoJSON({}), url});

const layer = new Layer({
  source,
  minZoom: 0,
  style: new Style({
    stroke: new Stroke({
      color: "#3399CC",
      width: 1.25
    })
  })
});

layer.set('name', 'state');
layer.set('featureHtml', html);

store('stateLayer', layer);

export default layer;
