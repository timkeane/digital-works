import $ from 'jquery';
import Chart from 'chart.js/auto';
import {getSessions} from '../sessions';
import {getStateName} from '../util';

const options =  {
  elements: {
    bar: {
      backgroundColor: '#7cc3e9',
      borderColor: '#111a52',
      borderWidth: 1,
      borderRadius: {topLeft: 4, topRight: 4},
      borderSkipped: false
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(17,26,82,.1)'
      }
    },
    y: {
      grid: {
        z: 2,
        color: 'rgba(17,26,82,.1)'
      }
    }
  },
  plugins: {
    title: {
      display: true,
      font: {
        size: 16,
        weight: 'bold'
      }
    },
    legend: {
      display: false
    },
    tooltip: {
      enabled: false,
      external: externalTip
    }
  }
};

const canvas = $('#chart canvas').get(0);
let chart;

function getBody(bodyItem) {
  return bodyItem.lines;
}

function getTitle(tooltipModel) {
  const title = tooltipModel.title[0];
  if (title.length === 2) {
    return getStateName(title);
  }
  return title;
}

function externalTip(context) {
  const tip = $('.chart-tip');
  const tooltipModel = context.tooltip;
  if (tooltipModel.opacity === 0) {
    tip.hide();
  } else {
    const people = tooltipModel.body.map(getBody)[0][0];
    const position = context.chart.canvas.getBoundingClientRect();
    const title = getTitle(tooltipModel);
    const html = $(`<div><h3>${title}</h3></div>`)
      .append(`<div><span class="field" data-i18n="[prepend]prop.name.number_of_people_trained">:</span> <span class="value">${people}</span></div>`);
    tip.html(html).localize().css({
      left: `${position.left + window.pageXOffset + tooltipModel.caretX}px`,
      top: `${position.top + window.pageYOffset + tooltipModel.caretY}px`
    }).show();
  }
}

function createStateChart() {
  const states = {};
  getSessions().forEach(session => {
    const state = session['State'];
    if (state) {
      states[state] = states[state] || {'Number of People Trained': 0};
      states[state]['State'] = state;
      states[state]['Number of People Trained'] = states[state]['Number of People Trained'] + (session['Number of People Trained'] * 1);
    }
  });

  options.plugins.title.text = 'Number of people trained by state';
  
  chart = new Chart(canvas, {
    type: 'bar',
    options,
    data: {
      labels: Object.values(states).map(row => row['State']),
      datasets: [{
        data: Object.values(states).map(row => row['Number of People Trained'])
      }]
    }
  });
}

function createTypeChart() {
  const types = {};
  getSessions().forEach(session => {
    const type = session['Project Type'];
    if (type) {
      types[type] = types[type] || {'Number of People Trained': 0};
      types[type]['Project Type'] = type;
      types[type]['Number of People Trained'] = types[type]['Number of People Trained'] + (session['Number of People Trained'] * 1);
    }
  });

  options.plugins.title.text = 'Number of people trained by project type';

  chart = new Chart(canvas, {
    type: 'bar',
    options,
    data: {
      labels: Object.values(types).map(row => row['Project Type']),
      datasets: [{
        data: Object.values(types).map(row => row['Number of People Trained'])
      }]
    }
  });
}

function createYearChart() {
  const years = {};
  getSessions().forEach(session => {
    const year = session['Year of Engagement'];
    if (year) {
      years[year] = years[year] || {'Number of People Trained': 0};
      years[year]['Year of Engagement'] = year;
      years[year]['Number of People Trained'] = years[year]['Number of People Trained'] + (session['Number of People Trained'] * 1);
    }
  });

  options.plugins.title.text = 'Number of people trained by year';

  chart = new Chart(canvas, {
    type: 'bar',
    options,
    data: {
      labels: Object.values(years).map(row => row['Year of Engagement']),
      datasets: [{
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
