import $ from 'jquery';
import {getAppPath, store} from '../util';
import {createResizeHandler} from './resize';

function setTabAction() {
  $('#nav button').on('click', event => {
    const id = event.target.id;
    $('#view-type, #map-type, #chart-type')[id !== 'map-tab' ? 'fadeOut' : 'fadeIn']();
  });
}

export default function() {
  return new Promise((resolve, reject) => {
    import(`./banner/${getAppPath()}.js`).then(html => {
      const banner = $(html.default).attr('id', 'banner').addClass('banner');
      const challengeTab = $('#challenges');
      $('body').prepend(banner.localize());
      banner.find('h1, div').on('click', () => {
        document.location = `./?locale=${$('html').prop('lang')}`;
      });
      createResizeHandler();
      store('challengeTab', challengeTab);
      setTabAction();
      resolve({
        banner,
        mapButton: $('#map-tab'),
        map: $('#map-container').get(0),
        tabs: {
          location: $('#locations'),
          layers: $('#layers'),
          challenge: challengeTab,
          content: $('#tab-content')
        }
      });
    }).catch(error => {
      console.error({error, message: 'Failed to load banner.'})
    });
  });
}
