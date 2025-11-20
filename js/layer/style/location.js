import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';

export default function(feature, resolution) {
  const people = feature.get('people');
  let radius = people / 200;
  if (radius < 5) radius = 5;
  return new Style({
    zIndex: -people,
    image: new Circle({
      radius,
      stroke: feature.get('highlight') ? new Stroke({width: 4, color: '#111a52'}) : new Stroke({color: '#fff'}),
      fill: new Fill({color: '#3399CC'})
    })
  });
}
