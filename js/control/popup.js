import $ from 'jquery';
import Overlay from 'ol/Overlay';
import {getPopupOverlay, getLocationLayer} from '../util';

const html = $(`<div id="popup" class="popup">
  <a href="#" id="popup-closer" class="popup-closer" data-i18n="[aria-label]btn.close.name;[title]btn.close.name" rel="noopener"></a>
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
</div>`);

export function hidePopup() {
  getPopupOverlay().setPosition(undefined);
  $('#popup').css('opacity', 0).show();
}

function showPager(featureHtml) {
  $('body').append(featureHtml);
  const orgs = featureHtml.find('.feature-org:visible').hide();
  $(orgs.get(0)).show();
  const pager = $('#popup-pager').data('orgs', orgs);
  if (orgs.length > 1) {
    pager.find('.at').html(1);
    pager.find('.end').html(orgs.length);
    pager.localize().css('display', 'inline-block');
  } else {
    pager.hide();
  }
}

function pageOrgs(event) {
  const pager = $('#popup-pager');
  const button = $(event.currentTarget);
  const orgs = pager.data('orgs').hide();
  const at = pager.find('.at');
  const index = at.html() - 1;
  const incriment = parseInt(button.attr('data-incriment'));
  if (index + incriment < orgs.length && index + incriment > 0) {
    at.html(index + incriment + 1);
    $(orgs[index + incriment]).show();
  } else {
    at.html(1);
    $(orgs.get(0)).show();
  }
  panPopup();
}

function showPopup(map, coordinate, feature, featureHtml) {
  const popup = $('#popup').attr('dir', $('html').attr('dir'));
  const popupOverlay = map.get('popupOverlay');
  const content = $('#popup-content');
  if (featureHtml) {
    popup.attr('data-fid', feature.getId());
    showPager(featureHtml);
    content.html(featureHtml);
    popupOverlay.setPosition(coordinate);
    popup.animate({opacity: 1});
    $('.popup-closer').one('click', event => {
      popup.fadeOut(() => hidePopup());
    });
  }
}

function layerFilter(layer) {
  const name = layer.get('name');
  if (layer)
  return name === 'location' || (name === 'state' && !getLocationLayer().getVisible());
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
      return true;
    }, {hitTolerance: 5, layerFilter});
    $('#popup')[getLocationLayer().getVisible() ? 'removeClass' : 'addClass']('state');
    showPopup(map, event.coordinate, features[0], htmlFeatures[0]);
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

function panPopup() {
  setTimeout(() => {
    getPopupOverlay().panIntoView({margin: 0});
  }, 500);
}

export function createPopup(map) {
  $('body').append(html).localize();
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
  $('#popup-pager .previous, #popup-pager .next').on('click', pageOrgs);
}
