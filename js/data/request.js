import papa from 'papaparse';
import complete from './manage';

const url = '/data/locations.csv';

const columns = [
  'ID',
  'Organization',
  'Organization Type',
  'Training Date'
  ,'Address'
  ,'City'
  ,'State'
  ,'Zip Code'
  ,'Longitude'
  ,'Latitude'
  ,'Number Trained',
  'Project Type',
  'Taining Topic'
];

const config = {
  quotes: false,
  quoteChar: '"',
  escapeChar: '"',
  delimiter: ",",
  header: true,
  newline: "\n",
  skipEmptyLines: true,
  columns: ['ID','Organization','Organization Type','Training Date','Address','City','State','Zip Code','Longitude','Latitude','Number of People Trained','Project Type','Taining Topic'],
  complete,
  error
};

function error(err, file, inputElem, reason) {
  console.error({err, file, inputElem, reason});
}

export default function() {
  papa.parse(url, config);
}
