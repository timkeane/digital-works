import $ from 'jquery';
import {getSelectedFeature, getLocationLayer, store} from '../util';
import {highlight} from '../layer/highlight';
import {LineString} from 'ol/geom';

const tabsAndLists = {};

function locationOnClick(feature, h4) {
  h4.on('click', () => {
    store('selectedFeature', feature);
    listHighlight();
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

function sortByState(features) {
  return features.sort((f0, f1) => {
    const d0 = f0.get('sessions')[0];
    const d1 = f1.get('sessions')[0];
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

function setDistance(location, feature) {
  const geom = feature.getGeometry();
  const featureCoord = geom.getCoordinates();
  const line = new LineString([location, featureCoord]);
  const distance = line.getLength();
  feature.set('distance', distance);
}

export function sortByDistance(location) {
  const features = getLocationLayer().getSource().getFeatures();
  if (location) {
    features.sort((f0, f1) => {
      setDistance(location, f0);
      setDistance(location, f1);
      const dist0 = f0.get('distance');
      const dist1 = f1.get('distance')
      if (dist0 < dist1) {
        return -1;
      } else if (dist0 > dist1) {
        return 1;
      }
      return 0
    });
    updateLocationList({features, distance: true});
  }
}

export function updateLocationList(event) {
  const locationList = $('#location-list').empty();
  const features = event.features; 
  const layer = getLocationLayer();
  const fHtml = layer.get('featureHtml');
  if (!event.distance) sortByState(features);
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
