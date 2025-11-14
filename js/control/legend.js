import $ from 'jquery';
import Control from 'ol/control/Control';
import {getBgLayer, getPrimaryLayer} from '../util';

const html = `<div id="legend" class="legend">
  <div class="legend-content">
    <div class="layer">
      <input id="primary-check" type="checkbox"
        class="form-check-input layer-check"
        checked disabled>
      <h3>
        <img src="img/served.svg" data-i18n="[alt]legend.served">
        <label for="primary-check" data-i18n="layer.primary.name">
      </h3>
    </div>
    <div class="layer" aria-hidden="true">
      <input id="bg-check" type="checkbox"
        class="form-check-input layer-check">
      <h3>
        <img src="img/bg.svg" data-i18n="[alt]layer.bg.name">
        <label for="bg-check" data-i18n="layer.bg.name"></label></h3>
    </div>
  </div>
</div>`;

$('body').append(html);

function toggleLayer(event) {
  const input = $(event.target);
  const layer = input.data('layer');
  const visible = input.is(':checked');
  const which = layer.get('name');
  layer.setVisible(visible);
  $(`#location-list li.${which}`)[visible ? 'show' : 'hide']();
}

export function createLegend(map, layersTab) {
  const legend =  $('#legend');
  const view = map.getView();

  legend.find('#primary-check')
    .data('layer', getPrimaryLayer())
    .on('change', toggleLayer);

  legend.find('#bg-check')
    .data('layer', getBgLayer())
    .on('change', toggleLayer);

  view.on('change:resolution', () => {
    const input = $('#primary-check');
    const zoom = view.getZoom();
    const layer = input.data('layer');
    const legLayer = input.parent();
    const disabled = zoom <= layer.getMinZoom();
    const title = disabled ? $('<span data-i18n="legend.disabled"/>').localize().html() : '';
    $(input).prop('disabled', disabled);
    legLayer[disabled ? 'addClass' : 'removeClass']('disabled')
        .attr({title, 'aria-label': title});
    layersTab.find('p.message')[disabled ? 'slideDown' : 'slideUp']();
  });

  const control = new Control({target: layersTab.get(0), element: legend.get(0)});
  control.setMap(map);
}
