import Source from 'ol/source/Vector';

export default {
  source: new Source({}),
  pastMonths: [],
  sessions: [],
  headCount: {
    state: {},
    location: {}
  }
};

export function getHeadCountByLocation() {
  return storage.headCount.location;
}

export function getHeadCountByState(feature) {
  if (feature) {
    return storage.headCount.state[feature.getId()];
  }
  return storage.headCount.state;
}
