import Id from './Id';
import Papa from 'papaparse';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import { setData } from '../../util';

const papaConfig = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\n",
  skipEmptyLines: false,
  columns: ['ID','Organization','Organization Type','Training Date','Address','City','State','Zip Code','Longitude','Latitude','Number of People Trained','Project Type','Taining Topic']
};
  
export default class Csv extends Id {
  constructor(options) {
    super(options);
    this.x = options.x;
    this.y = options.y;
  }
  readFeature(source, options) {
    let x = source[this.x];
    let y = source[this.y];
    const point = new Point([x * 1, y * 1]);
    const feature = super.readFeature(source, options);
    const dateString = feature.get('Training Date');
    if (!x || isNaN(x)) x = 0;
    if (!y || isNaN(y)) y = 0;
    if (dateString) {
      const dateParts = dateString.split('/');
      const date = new Date(`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
      feature.set('Training Date', date);
      feature.set('Year of Engagement', date.getFullYear());
    }
    feature.set('Training Topic', feature.get('Training Topic')?.trim());
    feature.setGeometry(point.transform(this.dataProjection, this.defaultFeatureProjection));
    return feature;
  }
  readFeatures(source, options) {
    const features = [];
    const parsed = Papa.parse(source, papaConfig);
    parsed.data.forEach(row => {
      const feature = this.readFeature(row);
      if (feature) features.push(feature);
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
    setData(aggregated);
    return aggregated;
  }
  readProjection() {
    return this.dataProjection;
  }
}
