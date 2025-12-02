import Style from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import {getFuture, getView} from '../../util';

export default function(feature, resolution) {  
  if (getFuture() === feature.get('has-future') && !feature.get('only-community-planning')) {
    const zoom = getView().getZoomForResolution(resolution) || .32;
    const people = feature.get('people') || 1;
    const highlight = feature.get('highlight');
    const width = highlight ? 4 : 1.25;
    const color = highlight ? '#acdef2' : '#3399CC';
    let radius = zoom * people / 50;
    if (radius < 5) radius = 5;
    return new Style({
      zIndex: -people,
      image: new Circle({
        radius,
        stroke: new Stroke({width, color: '#111a52'}),
        fill: new Fill({color})
      })
    });
  }
}
