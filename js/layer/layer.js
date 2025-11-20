import {setData, store} from '../util';
import {getCurrentLanguage} from '../i18n/i18n';
import {updateLocationList} from '../list/list';
import stateLayer from './state';
import trainingLayer, {highlight, zoomToFeature} from './training';
import $ from 'jquery';
import {createPopup} from '../control/popup';
import {forMobile} from '../html/resize';

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
          trainingSource.on('featuresloadend', forMobile);
          store('borderStyle', stateLayer.getStyle());
          map.addLayer(stateLayer);
          map.addLayer(trainingLayer);
          map.set('state', stateLayer);
          map.set('training', trainingLayer);
          map.on('singleclick', highlight);
          createPopup(map);
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
