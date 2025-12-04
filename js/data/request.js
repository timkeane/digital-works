import papa from 'papaparse';
import {processData as complete} from './dataProcessor';
import data from './data';

const url = './data/location.csv';

const config = {
  download: true,
  quotes: true,
  quoteChar: '"',
  delimiter: ',',
  header: true,
  newline: '\n',
  skipEmptyLines: true,
  columns: data.columns,
  complete,
  error
};

function error(err, file, inputElem, reason) {
  console.error({err, file, inputElem, reason});
}

export default function() {
  papa.parse(url, config);
}
