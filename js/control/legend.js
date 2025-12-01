import $ from 'jquery';
import Control from 'ol/control/Control';
import data from '../data/data';
import {getLocationLayer, getFuture, formatNumber} from '../util';

import * as ss from 'simple-statistics';

const html = `<div id="legend">
  <h3 role="button"></h3>
  <ul class="buckets">
    <li class="low"><div class="bucket"><div class="point"></div></div><span></span></li>
    <li class="high"><div class="bucket"><div class="point"></div></div><span></span></li>
    <li class="bucket bucket-0"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket bucket-1"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket bucket-2"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket bucket-3"><div></div><span class="from"></span> - <span class="to"></span></li>
    <li class="bucket bucket-4"><div></div><span class="from"></span> - <span class="to"></span></li>
  </ul>
</div>`;

$('body').append(html);

const legend =  $('#legend');

export function updateLegend() {
  const layer = getLocationLayer().getVisible() ? 'location' : 'state';
  const people = layer === 'location' ?  data.headCount.location : data.headCount.state;
  const future = getFuture();
  legend.removeClass('location').removeClass('state').addClass(layer);
  if (people) {
    const buckets = ss.jenks(Object.values(people), 5);
    const min = ss.min(Object.values(people)) || 1;
    if (layer === 'state') {
      for (let i = 0; i < 5; i = i + 1) {
        const from = Math.ceil(buckets[i]) || 1;
        const to = Math.floor(buckets[i + 1]);
        legend.find(`.bucket-${i} .from`).html(formatNumber(from));
        legend.find(`.bucket-${i} .to`).html(formatNumber(to));
      }
      legend.find(`.bucket-0 .from`).html(min);
    } else {

      // TODO FIX WHEN NULL ISLAND IS FIXED
      const max = 15 + (buckets[3] / 50);
      // const max = buckets[5] / 100;

      legend.find(`.high div.point`).css({width: `${max}px`, height: `${max}px`});
      legend.find(`.low span`).html(min);
      $('#legend.location div.bucket').css('width', `${max + 13}px`);

      // TODO FIX WHEN NULL ISLAND IS FIXED
      legend.find(`.high span`).html(formatNumber(buckets[3]));
      // legend.find(`.high span`).html(formatNumber(buckets[5]));
    }
  }

  let i18n = 'state';
  if (layer === 'location') i18n = 'location';
  if (future) i18n = 'future';
  legend.show();
  legend.find('h3').attr('data-i18n', `legend.title.${i18n}`).localize();
}

function toggle() {
  const minimized = legend.hasClass('minimized');
  legend[minimized ? 'removeClass' : 'addClass']('minimized');
}

export function createLegend(map) {
  const control = new Control({element: legend.get(0)});
  const title = legend.find('h3');
  control.setMap(map);
  getLocationLayer().on('change:visible', updateLegend);
  legend.on('click', toggle);
  title.on('keyup', event => {
    if (event.key === 'Enter' || event.key === ' ')
      title.trigger('click');
  });
}
