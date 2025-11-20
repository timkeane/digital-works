import $ from 'jquery';
import Control from 'ol/control/Control';
import {getLocationLayer, getHeadCountByState, getHeadCountByLocation, formatNumber} from '../util';
import * as ss from 'simple-statistics';

const html = `<div id="legend">
  <h3>Legend</h3>
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
  const data = layer === 'location' ?  getHeadCountByLocation() : getHeadCountByState();

  if (data) {
    const buckets = ss.equalIntervalBreaks(Object.values(data), 5);
    if (layer === 'state') {
      for (let i = 0; i < 5; i = i + 1) {
        const from = Math.ceil(buckets[i]);
        const to = Math.ceil(buckets[i + 1]);
        $(`#legend .bucket-${i} .from`).html(formatNumber(from));
        $(`#legend .bucket-${i} .to`).html(formatNumber(to));
      }
    } else {
      const max = Math.floor(buckets[5] / 100);
      $(`#legend .low div`).css({width: '10px', height: '10px', 'margin-left': `${max / 2.5}px`});
      $(`#legend .high div`).css({width: `${max}px`, height: `${max}px`});
      $(`#legend .low span`).html(1);
      $(`#legend .high span`).html(formatNumber(buckets[5]));
      $(`#legend .high span`).css('padding-top', `${max / 4}px`);
    }
  }
  
  $('#legend').removeClass('location').removeClass('state').addClass(layer === 'location' ? 'location' : 'state');
  $('#legend h3').html(layer === 'location' ? 'People trained<br>by location' : 'People trained<br>by state');
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
