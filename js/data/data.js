import Source from 'ol/source/Vector';

export default {
  source: new Source({}),
  pastMonths: [],
  sessions: [],
  communityPlanning: [],
  headCount: {
    state: {},
    location: {}
  },
  columns: [
    'ID',
    'Organization',
    'Organization Type',
    'Training Date'
    ,'Address'
    ,'City'
    ,'State'
    ,'Zip Code'
    ,'Longitude'
    ,'Latitude'
    ,'Number Trained',
    'Project Type',
    'Taining Topic',
    'Language'
  ]
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
