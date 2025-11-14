import Id from './Id';
import Papa from 'papaparse';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';

const papaConfig = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\n",
  skipEmptyLines: false,
  columns: ['ID','Organization','Organization Type','Year of Engagement','Scheduled Training Date','Scheduled Workshops','Address','City','State','Zip Code','Longitude','Latitude','Number of People Trained','Project Type']
};
  
export default class Csv extends Id {
  constructor(options) {
    super(options);
    this.x = options.x;
    this.y = options.y;
  }
  readFeature(source, options) {
    const feature = super.readFeature(source, options);
    const point = new Point([source[this.x] * 1, source[this.y] * 1]);
    feature.setGeometry(point.transform(this.dataProjection, this.defaultFeatureProjection));
    return feature;
  }
  readFeatures(source, options) {
    const features = [];
    const parsed = Papa.parse(source, papaConfig);
    parsed.data.forEach(row => {
      features.push(this.readFeature(row));
    });
    return this.aggregate(features);
  }
  aggregate(features) {
    const aggregated = [];
    const featuresByLocation = {};
    features.forEach(feature => {
      const locationHash = feature.getGeometry().getCoordinates().join(':');
      featuresByLocation[locationHash] = featuresByLocation[locationHash] || [];
      featuresByLocation[locationHash].push(feature);
    });
    Object.values(featuresByLocation).forEach((features, id) => {
      const aggregatedFeature = new Feature(features[0].getGeometry());
      const data = [];
      features.forEach(feature => {
        data.push(feature.getProperties());
      });
      aggregatedFeature.setId(`aggregate-${id}`);
      aggregatedFeature.set('data', data);
      aggregated.push(aggregatedFeature);
    });
    return aggregated;
  }
  readProjection() {
    return this.dataProjection;
  }
}
