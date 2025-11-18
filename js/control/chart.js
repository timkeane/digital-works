import $ from 'jquery';
import Chart from 'chart.js/auto';
import {getData} from '../util';

const canvas = $('#chart canvas').get(0);
let chart;

function createStateChart() {
  const states = {};
  getData().forEach(session => {
    const state = session['State'];
    if (state) {
      states[state] = states[state] || {'Number of People Trained': 0};
      states[state]['State'] = state;
      states[state]['Number of People Trained'] = states[state]['Number of People Trained'] + (session['Number of People Trained'] * 1);
    }
  });

  // $(canvas).css('max-height', `${$(window).height() - 200}px`);

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.values(states).map(row => row['State']),
      datasets: [{
        label: 'Number of People Trained',
        data: Object.values(states).map(row => row['Number of People Trained'])
      }]
    }
  });
}

function createTypeChart() {
  const types = {};
  getData().forEach(session => {
    const type = session['Project Type'];
    if (type) {
      types[type] = types[type] || {'Number of People Trained': 0};
      types[type]['Project Type'] = type;
      types[type]['Number of People Trained'] = types[type]['Number of People Trained'] + (session['Number of People Trained'] * 1);
    }
  });

  // $(canvas).css('max-height', `${$(window).height() - 200}px`);

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.values(types).map(row => row['Project Type']),
      datasets: [{
        label: 'Number of People Trained',
        data: Object.values(types).map(row => row['Number of People Trained'])
      }]
    }
  });
}

function createYearChart() {
  const years = {};
  getData().forEach(session => {
    const year = session['Year of Engagement'];
    if (year) {
      years[year] = years[year] || {'Number of People Trained': 0};
      years[year]['Year of Engagement'] = year;
      years[year]['Number of People Trained'] = years[year]['Number of People Trained'] + (session['Number of People Trained'] * 1);
    }
  });

  // $(canvas).css('max-height', `${$(window).height() - 200}px`);

  console.warn(Object.values(years));
  
  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.values(years).map(row => row['Year of Engagement']),
      datasets: [{
        label: 'Number of People Trained',
        data: Object.values(years).map(row => row['Number of People Trained'])
      }]
    }
  });
}

export function renderChart(type) {
  chart?.destroy();
  if (type === 'state') createStateChart();
  if (type === 'type') createTypeChart();
  if (type === 'year') createYearChart();
}

export function createChart() {}
