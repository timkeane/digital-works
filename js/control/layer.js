import $ from 'jquery';
// import {getMap} from '../util';
// import {renderNextChunckOfFeatures} from '../list/list';

// const html = `<div id="filter-buttons">
//                 <button id="all-locations" class="btn btn-primary filter active" aria-pressed="true">All</button>
//                 <button id="primary-locations" class="btn btn-primary filter" aria-pressed="false" data-layer="primary">Primary</button>
//                 <button id="secondary-locations" class="btn btn-primary filter" aria-pressed="false" data-layer="secondary">Secondary</button>
//               </div>`;

function filterLocations(event) {
  // const target = $(event.target);
  // const map = getMap();
  // event.preventDefault();
  // renderNextChunckOfFeatures($('#location-list'));
  // $('button.filter').removeClass('active');
  // $('button.filter').attr('aria-pressed', false);
  // target.addClass('active');
  // target.attr('aria-pressed', true);
  // if (target.attr('id') === 'all-locations') {
  //   $('#locations li').removeClass('filtered');
  //   map.get('primary').setVisible(true);
  //   map.get('secondary').setVisible(true);
  // } else {
  //   const layerName = target.data('layer');
  //   $('#locations li').addClass('filtered');
  //   $(`#locations li.${layerName}`).removeClass('filtered');
  //   map.get('primary').setVisible(layerName === 'primary');
  //   map.get('secondary').setVisible(layerName === 'secondary');
  // }
}

export function createLayerControl() {
  // $('#locate').append(html);
  // $('button.filter').on('click', filterLocations);
  // $('.nav-item button').on('click', () => $('#filter-buttons').show());
  // $('#challenge-tab').on('click', () => $('#filter-buttons').hide());
}
