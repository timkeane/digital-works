import {setData} from '../util';
import {getCurrentLanguage} from '../i18n/i18n';
import {updateLocationList} from '../list/list';
import stateLayer from './state';
import trainingLayer, {highlight, zoomToFeature} from './training';
import $, { event } from 'jquery';

const env = import.meta.env;
const styleUrl = `${env.VITE_BASEMAP_URL}?token=${env.VITE_ARC_TOKEN}`;

export default function addLayers(map, restore) {
  $('#map-tab').on('click', zoomToFeature);
  return new Promise((resolve, reject) => {
    import('ol-mapbox-style').then(olms => {
      return new Promise(() => {
        olms.apply(map, `${styleUrl}&language=${getCurrentLanguage()}`).then(map => {
          const trainingSource = trainingLayer.getSource();
          trainingSource.on('featuresloadend', updateLocationList);
          trainingSource.on('featuresloadend', setData);
          stateLayer.setVisible(false);
          map.addLayer(stateLayer);
          map.addLayer(trainingLayer);
          map.set('state', stateLayer);
          map.set('training', trainingLayer);
          map.on('singleclick', highlight);
          $('#map-type').on('change', event => {
            const training = event.target.value === 'location';
            trainingLayer.setVisible(training);
            stateLayer.setVisible(!training);
          });
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
