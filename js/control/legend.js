import $ from 'jquery';
import Control from 'ol/control/Control';
import data from '../data/data';
import {getLocationLayer, getFuture, formatNumber} from '../util';

import * as ss from 'simple-statistics';

const html = `<div id="legend">
  <h3 role="button"></h3>
  <table><tbody>
    <tr class="min">
      <td class="bucket"><div class="point"></div></td><td class="label"></td>
    </tr>
    <tr class="avg">
      <td class="bucket"><div class="point"></div></td>
      <td class="label"></td>
    </tr>
    <tr class="max">
      <td class="bucket"><div class="point"></div></td>
      <td class="label"></td>
    </tr>
  </tbody></table>
  <ul class="buckets">
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
      const max = formatNumber(buckets[5]);
      const avg = Math.round(ss.average(Object.values(people)));
      const maxWidth = buckets[5] / 50;
      const avgWidth = maxWidth / 2;
      legend.find('table .bucket').css('width', `${maxWidth + 13}px`);
      legend.find('.max .label').html(`<span>${max} </span><span class="small">(max)</span>`);
      legend.find('.max .point').css({width: `${maxWidth}px`, height: `${maxWidth}px`});
      legend.find('.min .label').html(`<span>${min} </span><span class="small">(min)</span>`);
      legend.find('.avg .label').html(`<span>${avg} </span><span class="small">(avg)</span>`);
      legend.find('.avg .point').css({width: `${avgWidth}px`, height: `${avgWidth}px`});
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
