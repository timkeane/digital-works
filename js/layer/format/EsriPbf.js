import Id from './Id';
import arcgisPbfDecode from 'arcgis-pbf-parser';

export default class EsriPbf extends Id {
  constructor(options) {
    super(options);
  }
  getType() {
    return 'arraybuffer';
  }
  readFeature(source, options) {
    const geoJson = arcgisPbfDecode(new Uint8Array(source));
    const feature = super.readFeature(geoJson.featureCollection.features[0], options);
    return feature;
  }
  readFeatures(source, options) {
    const geoJson = arcgisPbfDecode(new Uint8Array(source));
    const features = super.readFeatures(geoJson.featureCollection, options);
    return features;
  }
}
