import $ from 'jquery';
import {getFeaturesInView, getMap, getSelectedFeature, getTrainingLayer, getView} from '../util';
import {highlight} from '../layer/training';
import {storeChunksOfFeatures, getNextChunkOfFeatures} from './chunk';
import {getAddress} from '../control/locate';

const tabsAndLists = {};

function hideShowLocationMesssage(list) {
    const count = list.find('li:visible').length;
    const tab = tabsAndLists.tabs.location;
    const message = tab.find('.message');
    const hasItems = count > 0;
    if (hasItems) {
      const alert = $(`<div>
        <span data-i18n="list.alert.showing"></span>
        ${count}
        <span data-i18n="list.alert.sites"></span>
        ${getAddress()}
        </div>`)
        .localize().text();
      list.attr('aria-alert', alert);
      message.hide();
    } else {
      list.removeAttr('aria-alert');
      message.show();
    }
}

function hideShowChallengeMesssage(list) {
  const tab = tabsAndLists.tabs.challenge;
  const hasItems = list.children().length > 0;
  tab.find('.message')[hasItems ? 'hide' : 'show']();
}

function locationOnClick(feature, h4) {
  h4.on('click', () => {
    $('#map-tab').data('feature', feature);
    highlight(feature);
  });
}

function appendToLocationList(locationList, feature, featureHtml, visible) {
  const li = $('<li class="list-group-item"></li>')
    .append(featureHtml(feature, 'location'))
    .attr('data-fid', feature.getId());
  if (!visible) li.addClass('filtered');
  locationList.append(li);
  locationOnClick(feature, li.find('h4'));
}

export function listHighlight() {
  const id = getSelectedFeature()?.getId();
  const item = $(`li[data-fid="${id}"]`);
  $('#location-list li').each((i, li) => $(li).removeClass('highlight'));
  if (item.length) {
    item.addClass('highlight');
    if (!$('#locations').is(':visible')) {
    }
  }
}

// export function renderNextChunckOfFeatures(locationList) {
//   const features = getNextChunkOfFeatures();
//   const layer = getTrainingLayer();
//   const fHtml = layer.get('featureHtml');
//   features.forEach(feature => {
//     appendToLocationList(locationList, feature, fHtml, layer.getVisible());
//   });
// }

function sort(features) {
  return features.sort((f0, f1) => {
    const d0 = f0.get('data')[0];
    const d1 = f1.get('data')[0];
    const a0 = `${d0['State']}:${d0['City']}:${d0['Zip Code']}`;
    const a1 = `${d1['State']}:${d1['City']}:${d1['Zip Code']}`;
    if (a0 < a1) {
      return -1;
    } else if (a0 > a1) {
      return 1;
    }
    return 0;
  });
}

export function updateLocationList(event) {
  const locationList = $('#location-list').empty();
  const layer = getTrainingLayer();
  const fHtml = layer.get('featureHtml');
  const features = sort(event.features);
  features.forEach(feature => appendToLocationList(locationList, feature, fHtml, true));
  $('#locate button').removeClass('loading');
}

export function createLists(layout) {
  const locationTab = layout.tabs.location;
  const locationList = $('<ul id="location-list" class="list-group"></ul>');

  tabsAndLists.tabs = layout.tabs;
  tabsAndLists.lists = {location: locationList};
  tabsAndLists.mapButton = layout.mapButton;

  locationTab.append(locationList);

  $('#location-tab').on('click', () => {
    const item = $('#locations').find('li.highlight');
      item.get(0)?.scrollIntoView({behavior: 'smooth'});
  });

  // const content = $('#tab-content');
  // content.on('scroll', event => {
  //   const scrollTop = content.scrollTop();
  //   if (locationTab.is(':visible')) {
  //     const modifier = 200; 
  //     const listHeight = locationList.height();
  //     const currentScroll = scrollTop + content.height();
  //     $('#location-tab').data('scroll-top', scrollTop);
  //     if (currentScroll + modifier > listHeight) {
  //       renderNextChunckOfFeatures(locationList);
  //     }
  //   }
  // });
}
