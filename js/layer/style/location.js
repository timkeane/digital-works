import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import {getFuture, getView} from '../../util';

  // temporary until fix null island
import Icon from 'ol/style/Icon';

export default function(feature, resolution) {

  // temporary until fix null island
  if (feature.getGeometry().getCoordinates()[0] === 0) {
    return new Style({
      image: new Icon({src: 'img/null-island.png'}),
      width: 150,
      height: 150
    });
  }
  const zoom = getView().getZoomForResolution(resolution);
  const people = getFuture() ? 1 : feature.get('people');
  let radius = zoom * people / 50;
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
