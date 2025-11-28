import $ from 'jquery';
import Control from 'ol/control/Control';
import {getLocationLayer, getHeadCountByState, getHeadCountByLocation, formatNumber, getFuture} from '../util';
import * as ss from 'simple-statistics';

const html = `<div id="legend">
  <h3></h3>
  <ul class="buckets">
    <li class="low"><div></div><span></span></li>
    <li class="high"><div></div><span></span></li>
    <li class="bucket-0"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket-1"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket-2"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket-3"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket-4"><div></div><span class="from"></span> - <span class="to"></span></li>
  </ul>
</div>`;

$('body').append(html);

export function updateLegend() {
  const trainingLayer = getLocationLayer();
  const layer = trainingLayer.getVisible() ? 'location' : 'state';
  const people = layer === 'location' ?  getHeadCountByLocation() : getHeadCountByState();
  const future = getFuture();
  if (people) {
    const buckets = ss.jenks(Object.values(people), 5);
    const min = ss.min(Object.values(people)) || 1;
    if (layer === 'state') {
      for (let i = 0; i < 5; i = i + 1) {
        const from = Math.ceil(buckets[i]) || 1;
        const to = Math.floor(buckets[i + 1]);
        $(`#legend .bucket-${i} .from`).html(formatNumber(from));
        $(`#legend .bucket-${i} .to`).html(formatNumber(to));
      }
      $(`#legend .bucket-0 .from`).html(min);
    } else {
      // TODO FIX WHEN NULL ISLAND IS FIXED
      const max = 15 + (buckets[3] / 50);
      // const max = buckets[5] / 100;
      const w = $(`#legend .low div`).width()
      if (!future) $(`#legend .low div`).css('margin-left', `${(max / 2) - (w / 2)}px`);
      $(`#legend .high div`).css({width: `${max}px`, height: `${max}px`});
      $(`#legend .low span`).html(min);

      // TODO FIX WHEN NULL ISLAND IS FIXED
      $(`#legend .high span`).html(formatNumber(buckets[3]));
      // $(`#legend .high span`).html(formatNumber(buckets[5]));

      $(`#legend .high span`).css('padding-top', `${max / 4}px`);
    }
  }

  let i18n = 'state';
  if (layer === 'location') i18n = 'location';
  if (future) i18n = 'future';
  $('#legend').removeClass('location').removeClass('state').addClass(layer === 'location' ? 'location' : 'state');
  $('#legend h3').attr('data-i18n', `legend.title.${i18n}`).localize();
}

function toggle() {
  const minimized = $('#legend').hasClass('minimized');
  $('#legend')[minimized ? 'removeClass' : 'addClass']('minimized');
}

export function createLegend(map) {
  const legend =  $('#legend');
  const control = new Control({element: legend.get(0)});
  const trainingLayer = getLocationLayer();
  control.setMap(map);
  trainingLayer.on('change:visible', updateLegend);
  legend.on('click', toggle);
}
