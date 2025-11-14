import Feature from 'ol/Feature';
import GeoJSON from 'ol/format/GeoJSON.js';

export default class Id extends GeoJSON {
  constructor(options) {
    super(options);
    this.idPrefix = options.idPrefix;
    this.idProp = options.idProp;
    this.type = options.type;
  }
  readFeatureFromObject(object, options) {
    const feature = new Feature(object);
    feature.setId(this.idPrefix + feature.get(this.idProp));
    feature.set('type', this.type);
    return feature;
  }
}
