import $ from 'jquery';
import initI18n from './i18n/i18n';
import Map from 'ol/Map';
import Rotate from 'ol/control/Rotate';
import spin from './i18n/translate';
import createLayout from './html/layout';
import addLayers from './layer/layer';
import {store} from './util';
import {createLocator, getLocation} from './control/locate';
import {createLists} from './list/list';
import createControlPanel from './control/control-panel';
import createHelp from './control/help';
import {createLayerControl} from './control/layer';
import {createChart} from './control/chart';

function removeRotate(map) {
  const controls = map.getControls().getArray();
  const rotate = controls.filter(control => {
    return control instanceof Rotate;
  })[0];
  map.removeControl(rotate);
}

function load(restore) {
  createLayout().then(layout => {
    const map = new Map({target: layout.map});

    $('.ol-attribution button')
      .addClass('attribution')
      .one('click', () => {
        const cn = $('<a href="https://ConnectedNation.org" target="_blank" rel="noopeneer">Powered by ConnectedNation.org</a><br>');
        $('.ol-attribution li').prepend(cn).append(', The Noun Project');
        
      });

    removeRotate(map);
    store('map', map);

    addLayers(map, restore).then(map => {
      createHelp(layout.banner);
      createLocator(map, restore);
      createLists(layout, restore);
      createControlPanel();
      createLayerControl();

      map.once('postrender', () => {
        $(window).trigger('resize');
        $('#search').trigger('focus');
        createChart();
        $('body').removeClass('loading');
      });
      spin();

      // if (!hasStorage) showIntro();
    });
  });
}

initI18n().then(() => {
  load(false);
  // if (hasStorage) {
  //   if (getAlwaysLoad()) {
  //     load(true);
  //   } else {
  //     showRestoreDialog(load);
  //   }
  // } else {
  //   load(false);
  // }
});

// fetch('https://utility.arcgis.com/usrsvcs/servers/02d1b1a641694dcd89f63b06ecc0dd9e/rest/services/MN_LECP_Locations/FeatureServer/1/query/?f=geojson&outSR=3857&cacheHint=true&outFields=*&token=AAPK075a045352e64bd583ef4645224e213fBIBCnmrqPubNPP2Sxmi9DxqvDgDZBX1Toq4nMJu4bYGkd_TyL-Oaf426BVzX5-UW&esriSpatialRelIntersects&geometry=%7B%22xmin%22%3A-10412368.996946095%2C%22ymin%22%3A5856512.361743237%2C%22xmax%22%3A-10382596.774429018%2C%22ymax%22%3A5872029.0784851285%2C%22spatialReference%22%3A%7B%22wkid%22%3A102100%2C%22latestWkid%22%3A3857%7D%7D&where=1%20%3D%201')
// .then(r=>{
//   r.json().then(j=>console.warn(j));
// });