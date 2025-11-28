import {setData, store} from '../util';
import {getCurrentLanguage} from '../i18n/i18n';
import {updateLocationList} from '../list/list';
import stateLayer from './state';
import locationLayer, {highlight, zoomToFeature} from './location';
import $ from 'jquery';
import {createPopup} from '../control/popup';
import {forMobile} from '../html/resize';
import {updateLegend} from '../control/legend';

const env = import.meta.env;
const styleUrl = `${env.VITE_BASEMAP_URL}?token=${env.VITE_ARC_TOKEN}`;

export default function addLayers(map) {
  $('#map-tab').on('click', zoomToFeature);
  return new Promise((resolve, reject) => {
    import('ol-mapbox-style').then(olms => {
      return new Promise(() => {
        olms.apply(map, `${styleUrl}&language=${getCurrentLanguage()}`).then(map => {
          const locationSource = locationLayer.getSource();
          locationSource.on('featuresloadend', updateLocationList);
          locationSource.on('featuresloadend', forMobile);
          store('borderStyle', stateLayer.getStyle());
          map.addLayer(stateLayer);
          map.addLayer(locationLayer);
          map.set('state', stateLayer);
          map.set('location', locationLayer);
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
