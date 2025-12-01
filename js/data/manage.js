
export default function(results) {
  console.warn(results);
  if (results.errors?.length) {
    console.error('Papaparse errors:', results.errors);
  }
}