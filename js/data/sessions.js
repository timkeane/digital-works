// import {getHeadCount, setHeadCount} from '../util';
// import {updateLegend} from '../control/legend';

// const training = {sessions: []};

// export function setSessions(features) {
//   const headCount = getHeadCount();
//   features.forEach(feature => {
//     const sessions = feature.get('sessions');
//     let people = 0;
//     sessions.forEach(session => {
//       people = people + session['Number Trained'] * 1;
//     });
//     feature.set('people', people);
//     headCount.location[feature.getId()] = people;
//     training.sessions = training.sessions.concat(sessions);
//   });

//   const prop = 'State';
//   const sessions = getSessions();
//   const states = {};
//   sessions.forEach(session => {
//     if (session[prop]) {
//       let number = session['Number Trained'];
//       number = number?.trim() ? parseInt(number) : 0;
//       states[session[prop]] = states[session[prop]] || 0;
//       states[session[prop]] = states[session[prop]] + number;
//     }
//   });
//   headCount.state = states;
//   setHeadCount(headCount);
//   updateLegend();
// }

// export function getSessions() {
//   return training.sessions;
// }