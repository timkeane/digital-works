import {store} from '../util';
import {getCurrentLanguage} from '../i18n/i18n';
import {listHighlight, updateLocationList} from '../list/list';
import stateLayer from './state';
import locationLayer from './location';
import {highlight, zoomToFeature} from './highlight';
import $ from 'jquery';
import {createPopup} from '../control/popup';
import {forMobile} from '../html/resize';
import {createFeatureTips} from '../control/tip';
import {updateLegend} from '../control/legend';
import {populateStateFilter} from '../control/control-panel';

const env = import.meta.env;

export default function addLayers(map) {
  $('#map-tab').on('click', zoomToFeature);
  return new Promise((resolve, reject) => {
    import('ol-mapbox-style').then(olms => {
      const styleUrl = `${env.VITE_BASEMAP_URL}?token=${env.VITE_ARC_TOKEN}&language=${getCurrentLanguage()}`;
      return new Promise(() => {
        olms.apply(map, styleUrl).then(map => {
          const locationSource = locationLayer.getSource();
          locationSource.on('featuresloadend', updateLocationList);
          locationSource.on('featuresloadend', forMobile);
          locationSource.on('featuresloadend', updateLegend);
          stateLayer.getSource().on('featuresloadend', populateStateFilter);
          map.addLayer(stateLayer);
          map.addLayer(locationLayer);
          store('borderStyle', stateLayer.getStyle());
          map.on('singleclick', highlight);
          map.on('singleclick', listHighlight);
          createFeatureTips(map);
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
