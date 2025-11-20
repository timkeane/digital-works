import $ from 'jquery';
import {getMap, getView, getLocationLayer} from '../util';
import Overlay from 'ol/Overlay';

function filter(feature, flatStyle) {
  for (const i in flatStyle) {
    const filter = flatStyle[i].filter;
    if (feature.get(filter[1][1]) == filter[2]) {
      return flatStyle[i];
    }
  }
}

function getIconSrc(feature, flatStyle) {
  return flatStyle['icon-src'];
}

function getIconScale(view, feature, flatStyle) {
  // const style = filter(feature, flatStyle);
  const scale = style['icon-scale'];
  const z0 = scale[3];
  const z1 = scale[5];
  const exp = scale[1][1];
  const zoom = Math.floor(view.getZoom());
  const zooms = [];
  for (let i = z0; i <= z1; i++) {
    zooms.push(i);
  }
  let index = zooms.indexOf(zoom) + 1;
  if (index === 0) {
    index = zooms.length;
  }
  return Math.pow(exp, index) / Math.pow(exp, zooms.length);
}

export function pulseFeature(feature, listClick) {
  const map = getMap();
  const div = $(`<div class="pulse ${listClick ? 'list-click' : ''}"></div>`);
  $('body').append(div);
  const overlay = new Overlay({
    element: div.get(0),
    offset: [-30, -30]
  });
  map.addOverlay(overlay);

  const id = feature.getId();
  const layer = getLocationLayer();
  const pulse = $(overlay.getElement());
  const flatStyle =layer.getStyle();
  const scale = getIconScale(getView(), feature, flatStyle);
  const size = Math.floor(48 * scale);
  const src = getIconSrc(feature, flatStyle);

  pulse.css({
    'background-image': `url("${src}")`,
    'background-size': `${size}px`
  }).fadeIn();

  overlay.setPosition(feature.getGeometry().getCoordinates());

  setTimeout(() => {
    pulse.fadeOut(() => {
      map.removeOverlay(overlay);
      overlay.dispose();
      pulse.remove();
    });
  }, 3000);
}

export function createPulseAnimation() {
  // const challengeSource = getChallengeSource();
  // const selectedSource = getSelectSource();

  // function pulse(event) {
  //   pulseFeature(event.feature);
  // }

  // challengeSource.on('addfeature', pulse);
  // selectedSource.on('addfeature', pulse);
}
