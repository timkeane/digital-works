import {setData} from '../util';
import {getCurrentLanguage} from '../i18n/i18n';
import {updateLocationList} from '../list/list';
import stateLayer from './state';
import trainingLayer, {highlight, zoomToFeature} from './training';
import $ from 'jquery';
import {createEmpty, extend} from 'ol/extent';

const env = import.meta.env;
const styleUrl = `${env.VITE_BASEMAP_URL}?token=${env.VITE_ARC_TOKEN}`;

let trainingSource;
let trainingExtent;

function getTrainingExtent() {
  const features = trainingSource.getFeatures();
  if (features.length > 0) {
    if (!trainingExtent) {
      trainingExtent = createEmpty();
      features.forEach(feature => {
        extend(trainingExtent, feature.getGeometry().getExtent());
      });
    }
  }
  return trainingExtent;
}

function zoomFullExtent(map) {
  const i = setInterval(() => {
    if (getTrainingExtent()) {
      const view = map.getView();
      const size = map.getSize();
      const w = size[0];
      const padding = [w * .02, w * .02, w * .02, w * .02];
      view.fit(getTrainingExtent(), {padding, size, duration: 500});
      clearInterval(i);
    }
  }, 100);
}

export default function addLayers(map, restore) {
  $('#map-tab').on('click', zoomToFeature);
  return new Promise((resolve, reject) => {
    import('ol-mapbox-style').then(olms => {
      return new Promise(() => {
        olms.apply(map, `${styleUrl}&language=${getCurrentLanguage()}`).then(map => {
          trainingSource = trainingLayer.getSource();
          trainingSource.on('featuresloadend', updateLocationList);
          trainingSource.on('featuresloadend', setData);
          stateLayer.setVisible(false);
          map.addLayer(stateLayer);
          map.addLayer(trainingLayer);
          map.set('state', stateLayer);
          map.set('training', trainingLayer);
          map.on('singleclick', highlight);
          zoomFullExtent(map);
          $('#zoom-full').on('click', () => {
            zoomFullExtent(map);
          })
          resolve(map);
        }).catch(error => {
          console.error(error);
          reject(error);
        });
      });
    }).catch(error => {
      console.error(error);
      reject(error);
    });
  });
}
