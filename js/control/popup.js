import $ from 'jquery';
import Overlay from 'ol/Overlay';
import {getPopupOverlay} from '../util';

const html = $(`<div id="popup" class="popup">
  <a href="#" id="popup-closer" class="popup-closer" data-i18n=[aria-label]btn.close.name}" rel="noopener"></a>
  <div id="popup-content">
  </div>
  <div id="popup-pager">
    <button class="btn btn-secondary previous" data-incriment="-1" data-i18n="[title]popup.pager.previous;[aria-label]popup.pager.previous"><span>‹</span></button>
    <div>
      <span class="at">1</span>
      <span data-i18n="popup.pager.of"></span>
      <span class="end"></span>
    </div>
    <button class="btn btn-secondary next" data-incriment="1" data-i18n="[title]popup.pager.next;[aria-label]popup.pager.next"><span>›</span></button>
  </div>
  <div id="popup-standby" aria-hidden="true"></div>
</div>`);

export function hidePopup() {
  getPopupOverlay().setPosition(undefined);
  $('#popup')
    .removeClass('challenge')
    .css('opacity', 0)
    .show();
}

function showPager(features, htmlFeatures) {
  $('#popup-standby').empty()
  for (let i = 1; i < htmlFeatures.length; i = i + 1) {
    $('#popup-standby').append(htmlFeatures[i]);
  }
  const pager = $('#popup-pager')
    .data('features', features)
    .data('htmlFeatures', htmlFeatures);
  if (htmlFeatures.length > 1) {
    pager.find('.at').html(1);
    pager.find('.end').html(htmlFeatures.length);
    pager.localize().css('display', 'inline-block');
  } else {
    pager.hide();
  }
}

function pageFeatures(event) {
  // const popup = $('#popup').removeClass('challenge');
  // const content = $('#popup-content');
  // const pager = $('#popup-pager');
  // const button = $(event.target);
  // const features = pager.data('features');
  // const htmlFeatures = pager.data('htmlFeatures');
  // const at = pager.find('.at');
  // const index = at.html() - 1;
  // const incriment = parseInt(button.data('incriment'));
  // $('#popup-standby').append(content.find('.feature-html'));
  // if (index + incriment < htmlFeatures.length && index + incriment > 0) {
  //   const feature = features[index + incriment];
  //   const challenge = isChallenge(feature);
  //   at.html(index + incriment + 1);
  //   popup.attr('data-fid', feature.getId())
  //     .addClass(challenge ? 'challenge' : '');
  //   content.append(htmlFeatures[index + incriment]);
  // } else {
  //   const feature = features[0];
  //   const challenge = isChallenge(feature);
  //   at.html(1);
  //   popup.attr('data-fid', feature.getId())
  //     .addClass(challenge ? 'challenge' : '');
  //   content.html(htmlFeatures[0]);
  // }
  // panPopup();
}

function showPopup(map, coordinate, features, htmlFeatures) {
  const popup = $('#popup')
    .attr('dir', $('html').attr('dir'))
    .removeClass('challenge');
  const popupOverlay = map.get('popupOverlay');
  const content = $('#popup-content');
  if (htmlFeatures.length > 0) {
    const featureHtml = htmlFeatures[0];
    popup.attr('data-fid', features[0].getId())
      .addClass(features[0].get('challenge') ? 'challenge' : '');
    content.html(featureHtml);
    showPager(features, htmlFeatures);
    popupOverlay.setPosition(coordinate);
    popup.animate({opacity: 1});
    $('#popup-closer').one('click', event => {
      popup.fadeOut(() => hidePopup());
    });
  }
}

function layerFilter(layer) {
  return layer.get('name') === 'training' || layer.get('name') === 'state';
}

function getFeatureHtmls(event) {
  if (getPopupOverlay().active) {
    const map = event.map;
    const htmlFeatures = [];
    const features = [];
    map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      const featureHtml = layer.get('featureHtml');
      htmlFeatures.push(featureHtml(feature, 'popup'));
      features.push(feature);
    }, {hitTolerance: 5, layerFilter});
    showPopup(map, event.coordinate, features, htmlFeatures);
  }
}

function setActive(active) {
  const popup = $('#popup');
  this.active = active;
  setTimeout(() => {
    hidePopup();
    if (!active) {
      $('popup').hide();
    }
  }, 500);
}

export function panPopup() {
  setTimeout(() => {
    getPopupOverlay().panIntoView();
  }, 500);
}

export function createPopup(map) {
  $('body').append(html);
  const popup = $('#popup');
  const popupOverlay = new Overlay({
    element: popup.get(0),
    autoPan: {animation: {duration: 250}},
    className: 'overlay-2 ol ol-overlay-container ol-selectable'
  });
  popupOverlay.active = true;
  popupOverlay.setActive = setActive;

  map.addOverlay(popupOverlay);
  map.set('popupOverlay', popupOverlay);
  map.on('singleclick', getFeatureHtmls);
  $('#popup-pager .previous, #popup-pager .next').on('click', pageFeatures);
}
