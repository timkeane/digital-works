import $ from 'jquery';
import initI18n from './i18n/i18n';
import Map from 'ol/Map';
import Rotate from 'ol/control/Rotate';
import spin from './i18n/translate';
import createLayout from './html/layout';
import addLayers from './layer/layer';
import {store} from './util';
import {createLocator} from './control/locate';
import {createLists} from './list/list';
import createControlPanel from './control/control-panel';
import {createChart} from './control/chart';
import createZoomFull from './control/ZoomFull';
import {createLegend} from './control/legend';
import {showIntro} from './control/dialog';

function removeRotate(map) {
  const controls = map.getControls().getArray();
  const rotate = controls.filter(control => {
    return control instanceof Rotate;
  })[0];
  map.removeControl(rotate);
}

function load() {
  showIntro();
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

    addLayers(map).then(map => {
      createLocator(map);
      createLists(layout);
      createLegend(map);
      createControlPanel();
      createZoomFull(map);
      map.once('postrender', () => {
        $(window).trigger('resize');
        $('button#zoom-full').trigger('click');
        $('#search').trigger('focus');
        createChart();
        $('body').removeClass('loading');
        $(window).trigger('resize');
      });
      spin();
    });
  });
}

initI18n().then(() => {
  load(false);
});
