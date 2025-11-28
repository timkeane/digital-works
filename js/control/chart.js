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
      states[state] = states[state] || {'Number Trained': 0};
      states[state]['State'] = state;
      states[state]['Number Trained'] = states[state]['Number Trained'] + (session['Number Trained'] * 1);
    }
  });

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.values(states).map(row => row['State']),
      datasets: [{
        label: 'Number Trained',
        data: Object.values(states).map(row => row['Number Trained'])
      }]
    }
  });
}

function createTypeChart() {
  const types = {};
  getData().forEach(session => {
    const type = session['Project Type'];
    if (type) {
      types[type] = types[type] || {'Number Trained': 0};
      types[type]['Project Type'] = type;
      types[type]['Number Trained'] = types[type]['Number Trained'] + (session['Number Trained'] * 1);
    }
  });

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.values(types).map(row => row['Project Type']),
      datasets: [{
        label: 'Number Trained',
        data: Object.values(types).map(row => row['Number Trained'])
      }]
    }
  });
}

function createYearChart() {
  const years = {};
  getData().forEach(session => {
    const year = session['Year of Engagement'];
    if (year) {
      years[year] = years[year] || {'Number Trained': 0};
      years[year]['Year of Engagement'] = year;
      years[year]['Number Trained'] = years[year]['Number Trained'] + (session['Number Trained'] * 1);
    }
  });

  chart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: Object.values(years).map(row => row['Year of Engagement']),
      datasets: [{
        label: 'Number Trained',
        data: Object.values(years).map(row => row['Number Trained'])
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
