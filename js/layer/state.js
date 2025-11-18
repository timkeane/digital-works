import GeoJSON from 'ol/format/GeoJSON';
import Source from 'ol/source/Vector';
import Layer from 'ol/layer/Vector';
import html from '../feature/state';

const url = './data/state.json';

const source = new Source({format: new GeoJSON({}), url});

const layer = new Layer({
  source,
  minZoom: 0
});

layer.set('name', 'state');
layer.set('featureHtml', html);

export default layer;
