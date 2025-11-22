import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import {getHeadCountByState} from '../../util';
import * as ss from 'simple-statistics';

const colors = [
  '#a6bddb',
  '#74a9cf',
  '#3690c0',
  '#0570b0',
  '#034e7b'
];

export default function(feature, resolution) {
  const buckets = ss.jenks(Object.values(getHeadCountByState()), 5);
  const count = getHeadCountByState()[feature.getId()] || 0;

  let bucket = 0;
  while (bucket < 5) {
    if (count > buckets[bucket] && count <= buckets[bucket + 1]) {
      window.bucket = window.bucket || {};
      window.bucket[bucket] = window.bucket[bucket] ? window.bucket[bucket] + 1 : 1;
      break;
    };
    bucket = bucket + 1;
  }

  return new Style({
    stroke: new Stroke({width: 1, color: '#3399CC'}),
    fill: new Fill({color: colors[bucket] || 'transparent'})
  });
}
