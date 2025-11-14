import $ from 'jquery';
import Papa from 'papaparse';
import {getChallengeSource, columns} from '../util';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';

const papaConfig = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\n",
  skipEmptyLines: false,
  columns: getCsvColumns()
};

const geoJsonFormat = new GeoJSON({dataProjection: 'EPSG:3857'});

function getCsvColumns() {
  const csvColumns = [];
  columns.forEach(column => {
    if (column.csv !== undefined) {
      csvColumns.push(column.csv);
    }
  });
  return csvColumns;
}

function getRow(properties) {
  const row = {};
  columns.forEach(column => {
    row[column.csv] = properties[column.prop];
  });
  return row;
}

function getCoordinate(feature) {
  const geom = feature.getGeometry()
  return JSON.stringify(geom.getCoordinates());
}

function retreiveChallenges() {
  const challenges = localStorage.getItem('challenges');
  if (challenges !== null) {
    const featureCollection = JSON.parse(challenges);
    if (featureCollection.features.length > 0) {
      return featureCollection;
    }
  }
}

function restoreFeatures(source, geoJsonFeatures) {
  if (geoJsonFeatures !== undefined) {
    const features = geoJsonFormat.readFeatures(geoJsonFeatures);
    source.addFeatures(features);
  }
}

function getFeature(row) {
  const properties = {challenge: true};
  columns.forEach(column => {
    if (column.csv) {
      properties[column.prop] = row[column.csv];
    }
  });
  properties.geometry = new Point(JSON.parse(row.COORDINATE_DO_NOT_EDIT));
  const feature = new Feature(properties);
  feature.setId(row.FID_DO_NOT_EDIT);
  return feature;
}

function loadCsv(event) {
  const data = Papa.parse(event.target.result, {...papaConfig, skipFirstNLines: 1});
  const rows = data.data;
  const source = getChallengeSource();
  rows.forEach(row => {
    source.addFeature(getFeature(row));
  });
  storeChallenges(source.getFeatures());
}

export function hasLocalStorage() {
  return retreiveChallenges() !== undefined;
}

export function storeLocation(location) {
  localStorage.setItem('location', JSON.stringify(location));
}

export function restoreLocation() {
  const location = localStorage.getItem('location');
  if (location !== null) {
    return JSON.parse(location);
  }
}

export function storeChallenges(features) {
  const geoJsonFeatures = geoJsonFormat.writeFeatures(features);
  localStorage.setItem('challenges', geoJsonFeatures);
}

export function restoreChallenges(source) {
  restoreFeatures(source, retreiveChallenges());
}

export function saveAlwaysLoad(always) {
  localStorage.setItem('always', always);
}

export function getAlwaysLoad(always) {
  return localStorage.getItem('always') === 'true';
}

export function readCsv(event) {
  const file = event.target.files.item(0);
  const reader = new FileReader();
  reader.onload = loadCsv;
  reader.readAsText(file);
}

export function getAsCsv() {
  const rows = [];
  const source = getChallengeSource();
  const features = source.getFeatures();
  features.forEach(feature => {
    const row = getRow(feature.getProperties());
    row.FID_DO_NOT_EDIT = feature.getId();
    row.COORDINATE_DO_NOT_EDIT = getCoordinate(feature);
    rows.push(row);
  });
  return encodeURIComponent(Papa.unparse(rows, papaConfig));
}

export function saveChallengesCsv() {
  const href = `data:text/csv;charset=utf-8,${getAsCsv()}`;
  const a = $('<a class="csv-download"><img></a>');
  $('body').append(a);
  a.attr({href, download: 'mn_line_extension_bid.csv'}).find('img').trigger('click');
  a.remove();
}

export function loadChallengesCsv() {
  let input = $('#load-csv');
  if (input.length === 0) {
    input = $('<input id="load-csv" type="file">');
    $('body').append(input);
    input.on('change', readCsv);
  }
  input.trigger('click'); 
}

export function deleteStoredData() {
  localStorage.removeItem('challenges');
  localStorage.removeItem('location');
}
