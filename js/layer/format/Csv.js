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

function sortSessions(sessions) {
  sessions.sort((s0, s1) => {
      const date0 = s0['Training Date'];
      const date1 = s1['Training Date'];
      if (date0 < date1) {
        return -1;
      } else if (date0 > date1) {
        return 1;
      }
      return 0
    });
  return sessions;
}

function pad(num) {
  return num.length === 1 ? `0${num}` : num;
}

function isoDate(dateString) {
  const dateParts = dateString.split('/');
  return `${dateParts[2]}-${pad(dateParts[0])}-${pad(dateParts[1])}`;
}

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
    feature.set('future', false);
    if (dateString) {
      const date = isoDate(dateString);
      const today = (new Date()).toISOString().split('T')[0];
      feature.set('Training Date', date);
      feature.set('Year of Engagement', parseInt(date.split('-')[0]));
      feature.set('future', date > today);

  if (date>today){
    console.warn(feature.get('Address'), date, today);
  }else{
    console.log(feature.get('Address'), date, today);
  }

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
      let hasFuture = false;
      features.forEach(feature => {
        data.push(feature.getProperties());
        if (feature.get('future')) hasFuture = true;
      });
      aggregatedFeature.setId(`aggregate-${id}`);
      aggregatedFeature.set('has-future', hasFuture);
      aggregatedFeature.set('data', sortSessions(data));
      aggregated.push(aggregatedFeature);
    });
    setData(aggregated);
    return aggregated;
  }
  readProjection() {
    return this.dataProjection;
  }
}
