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
      break;
    };
    bucket = bucket + 1;
  }

  return new Style({
    stroke: new Stroke({width: 1.25, color: '#111a52'}),
    fill: new Fill({color: colors[bucket] || 'transparent'})
  });
}
