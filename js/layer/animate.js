import data from '../data/data';
import blankStyle from './style/blank';
import animateStyle from './style/animate';
import layer from './location';
import {formatNumber, getMap} from '../util';
import $ from 'jquery';
import { isCommunityPlanning, isFuture, validSession } from '../data/dataProcessor';

const calendar = $('#calendar');

function displayMonth(month, people) {
  const count = formatNumber(people);
  const parts = month.split('-');
  calendar.find('span.month').attr('data-i18n', `month.${parts[1]}`).localize();
  calendar.find('span.year').html(parts[0]);
  calendar.find('span.value').html(count);
  calendar.find('.people').css('visibility', 'visible');
}

function runAnimation(layer, style) {
  const map = getMap();
  const features = data.source.getFeatures();
  let allThePeeps = 0;
  let i = 0;
  layer.setStyle(animateStyle);
  const interval = setInterval(() => {
    const month = data.pastMonths[i];
    displayMonth(month, allThePeeps);
    features.forEach(feature => {
      const sessions = feature.get('sessions');
      sessions.forEach(session => {
        const sessionMonth = session.month; 
        const type = parseInt(session['Project Type']);
        const people = parseInt(session['Number Trained']);
        if (
          validSession(session) &&
          !isFuture(session) &&
          !isCommunityPlanning(session) && 
          sessionMonth === month && people > 0
        ) {
          const animate = feature.get('animate');
          feature.set('animate', animate + people);
          allThePeeps = allThePeeps + people;
          displayMonth(month, allThePeeps);
          map.renderSync();
        }
      });
    });
    i = i + 1;
    if (i === data.pastMonths.length) {
      clearInterval(interval);
      setTimeout(() => calendar.fadeOut(), 3000);
      layer.setStyle(style);
    }
  }, 500);
}

export default function animate() {
  const style = layer.getStyle();
  const features = data.source.getFeatures();
  calendar.fadeIn();
  layer.setStyle(blankStyle);
  features.forEach(feature => {
    feature.set('animate', 0);
  });
  setTimeout(() => {
    runAnimation(layer, style);
  }, 2000)
}
