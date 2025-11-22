import Control from 'ol/control/Control';
import $ from 'jquery';
import {createEmpty, extend} from 'ol/extent';

const html = '<div class="zoom-full ol-unselectable ol-control"><button id="zoom-full" class="btn" data-i18n="[title]zoom.full;[aria-label]zoom.full"></button></div>';

class ZoomFull extends Control {
  constructor() {
    const element = $(html).localize();
    super({element: element.get(0)});
    this.trainingExtent = null;
    element.find('button').on('click', this.zoom.bind(this));
  }

  getLocationExtent() {
    const layer = this.getMap().get('location');
    const features = layer.getSource().getFeatures();
    if (features.length > 0) {
      if (!this.trainingExtent) {
        this.trainingExtent = createEmpty();
        features.forEach(feature => {
          extend(this.trainingExtent, feature.getGeometry().getExtent());
        });
      }
    }
    return this.trainingExtent;
  }

  zoom() {
    const i = setInterval(() => {
      if (this.getLocationExtent()) {
        const map = this.getMap();
        const view = map.getView();
        const size = map.getSize();
        const w = size[0];
        const padding = [w * .02, w * .02, w * .02, w * .02];
        view.fit(this.getLocationExtent(), {padding, size, duration: 500});
        clearInterval(i);
      }
    }, 100);
  }
}

export default function createZoomFull(map) {
  map.addControl(new ZoomFull());
}