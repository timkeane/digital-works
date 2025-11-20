import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import {getHeadCountByState} from '../../util';
import * as ss from 'simple-statistics';

const colors = [
  '#f1eef6',
  '#bdc9e1',
  '#74a9cf',
  '#2b8cbe',
 ' #045a8d'
];

export default function(feature, resolution) {
  const buckets = ss.equalIntervalBreaks(Object.values(getHeadCountByState()), 5);
  const count = getHeadCountByState()[feature.getId()] || 0;
  
  let bucket = 0;
  while (bucket < 5) {
    if (count <= buckets[bucket]) break;
    bucket = bucket + 1;
  }

  return new Style({
    stroke: new Stroke({width: 1, color: '#3399CC'}),
    fill: new Fill({color: colors[bucket]})
  });
}
