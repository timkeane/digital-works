import $ from 'jquery';
import {getPrimaryLayer, getBgLayer, getSecondaryLayer} from '../util';
import Overlay from 'ol/Overlay';
import {i18nAddress} from '../feature/html';
import secondary from '../layer/style/secondary';

let nextId = 0;
function getNextId() {
  nextId = nextId + 1;
  return `tip-${nextId}`;
}

class FeatureTip extends Overlay {
  constructor(options) {
    const element = $(options.map.getTargetElement())
      .find('.feature-tip')
      .get(0);
    super({
      id: getNextId(),
      element: element || $(FeatureTip.HTML).get(0),
      offset: [5, 5],
      className: 'overlay-1 ol ol-overlay-container ol-selectable'
    });
    this.setMap(options.map);
    this.map = this.getMap();
    this.tip = $(this.getElement());
    this.addTips(options.tips);
    this.map.on('pointermove', this.label.bind(this));
  }
  hide() {
    this.tip.fadeOut(() => {
      this.setPosition(undefined);
    });
  }
  addTips(tips) {
    tips.forEach(def => {
      def.layer.tip = def.label;
    });
  }
  out(event) {
    if (!$.contains(this.map.getTargetElement(), event.target)) {
      this.hide();
    }
  }
  label(event) {
    const label = this.map.forEachFeatureAtPixel(event.pixel, (feature, layer) => {
      return layer && layer.getVisible() && layer.tip ? layer.tip(feature) : null;
    });
    if (label) {
      this.tip.html(label.html);
      this.tip.addClass(label.css);
      this.setPosition(event.coordinate);
      this.tip.localize().show();
      this.position();
    } else {
      this.hide();
    }
  }
  position() {
    const size = this.map.getSize();
    const width = this.tip.width();
    const height = this.tip.height();
    const position = this.map.getPixelFromCoordinate(this.getPosition());
    const vert = position[1] + height > size[1] ? 'bottom' : 'top';
    const horz = position[0] + width > size[0] ? 'right' : 'left';
    this.setPositioning(`${vert}-${horz}`);
  }
}

/**
 * @desc Object with configuration options for feature tips
 * @public
 * @typedef {Object}
 * @property {module:ol/layer/Vector} layer The layer whose features will have tips
 * @property {module:FeatureTip~FeatureTip.LabelFunction} label A function to generate tips
 */
FeatureTip.TipDef;

/**
 * @desc Label function that returns a {@link module:FeatureTip/~FeatureTip.Label}
 * @public
 * @typedef {function(ol.Feature):module:FeatureTip~FeatureTip.Label}
 */
FeatureTip.LabelFunction;

/**
 * @desc Object type to return from a feature's label function
 * @public
 * @typedef {Object}
 * @property {jQuery|Element|string} html The tip content
 * @property {string=} css A CSS class to apply to the tip
 */
FeatureTip.Label;

/**
 * @desc Constructor options for FeatureTip
 * @public
 * @typedef {Object}
 * @property {module:ol/Map} map The map
 * @property {Array<module:FeatureTip~FeatureTip.TipDef>} tips The tip definitions
 */
FeatureTip.Options

/**
 * @private
 * @const
 * @type {string}
 */
FeatureTip.HTML = '<div class="feature-tip" role="tooltip"></div>';

function primaryTip(feature) {
  const address = i18nAddress({
    name: feature.get('busname'),
    addr: feature.get('streetaddress'),
    city: feature.get('city'),
    state: '<span data-i18n="feature.value.addr_state"></span>',
    zip: feature.get('zipcode')
  });
  const div = $(`<div class="address">${address}</div>`);
  const html = $('<div><div class="title" data-i18n="layer.primary.name"></div></div>')
    .append(div);
  return {html};
}

function secondaryTip(feature) {
  const address = i18nAddress({
    name: feature.get('busname'),
    addr: feature.get('streetaddress'),
    city: feature.get('city'),
    state: '<span data-i18n="feature.value.addr_state"></span>',
    zip: feature.get('zipcode')
  });
  const div = $(`<div class="address">${address}</div>`);
  const html = $('<div><div class="title" data-i18n="layer.secondary.name"></div></div>')
    .append(div);
  return {html};
}

function blockGroupTip(feature) {
  const tr = feature.get('tr');
  const bg = feature.get('bg');
  const html = $(`<div>
    <div class="title" data-i18n="[prepend]feature.field.tr"> ${tr}</div>
    <div class="title" data-i18n="[prepend]feature.field.bg"> ${bg}</div>
  </div>`);
  return {html};
}

export function createFeatureTips(map) {
  new FeatureTip({
    map,
    tips: [
      {layer: getPrimaryLayer(), label: primaryTip},
      {layer: getSecondaryLayer(), label: secondaryTip},
      {layer: getBgLayer(), label: blockGroupTip}
    ]
  });
}
