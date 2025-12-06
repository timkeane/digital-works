import $ from 'jquery';
import Overlay from 'ol/Overlay';
import {getDisplayAddress} from '../data/dataProcessor';
import {formatNumber, getLocationLayer, getStateLayer} from '../util';
import data from '../data/data';

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

function locationTip(feature) {
  if (getLocationLayer().getVisible()) {
    const address = feature.get('formatted_address');
    const people = data.headCount.location[feature.getId()];
    const html = $(`<div class="location"><h3>${address}</h3></div>`)
      .append(people ? `<div class="prop people"><span class="field" data-i18n="prop.name.number_trained"></span> <span class="value">${formatNumber(people)}</span></div>` : '');
    return {html};
  }
}

function stateTip(feature) {
  if (!getLocationLayer().getVisible()) {
    const state = feature.get('name');
    const people = data.headCount.state[feature.getId()] || 0;
    const html = $(`<div class="state"><h3>${state}</h3></div>`)
      .append(`<div class="prop people"><span class="field" data-i18n="prop.name.number_trained"></span> <span class="value">${formatNumber(people)}</span></div>`);
    return {html};
  }
}

export function createFeatureTips(map) {
  new FeatureTip({
    map,
    tips: [
      {layer: getLocationLayer(), label: locationTip},
      {layer: getStateLayer(), label: stateTip}
    ]
  });
}
