import Vector from 'ol/source/Vector';
import LineString from 'ol/geom/LineString';
import {getLocation} from '../util';

const chunksOfFeatures = {source: new Vector(), chunks: []};

function append(features) {
  const source = chunksOfFeatures.source;
  source.addFeatures(features);
  return sort(source.getFeatures());
}

export function sort(features) {
  const userCoord = getLocation();
  if (userCoord) {
    if (features.length === 1) {
      setDistance(userCoord, features[0]);
      return features;
    }
    features.sort((f0, f1) => {
      setDistance(userCoord, f0);
      setDistance(userCoord, f1);
      const dist0 = f0.get('distance');
      const dist1 = f1.get('distance')
      if (dist0 < dist1) {
        return -1;
      } else if (dist0 > dist1) {
        return 1;
      }
      return 0
    });
  }
  return features;
}

export function empty() {
  chunksOfFeatures.source.clear();
}

export function storeChunksOfFeatures(features, max) {
  const allFeatures = append(features);
  const size = Math.min(max, Math.ceil(allFeatures.length / 2));
  const length = Math.ceil(allFeatures.length / size);
  chunksOfFeatures.chunks = Array.from({length},
    (_, i) => allFeatures.slice(i * size, i * size + size)
  );
  chunksOfFeatures.nextChunck = 0;
}

export function getNextChunkOfFeatures() {
  const chunk = chunksOfFeatures.chunks[chunksOfFeatures.nextChunck];
  if (chunk !== undefined) {
    chunksOfFeatures.nextChunck = chunksOfFeatures.nextChunck + 1;
    return chunk;
  }
  return [];
}
