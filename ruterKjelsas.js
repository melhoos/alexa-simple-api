const fetch = require('node-fetch');
const moment = require('moment');

const bussUrl = 'https://reisapi.ruter.no/StopVisit/GetDepartures/3012161';
const trikkUrl = 'https://reisapi.ruter.no/StopVisit/GetDepartures/3012162';
const togUrl = 'https://reisapi.ruter.no/StopVisit/GetDepartures/3012160';

moment.locale('nb');

module.exports = {
  buss: (res) => {
    fetch(bussUrl)
    .then(response => response.json())
    .then(data => {
      const departures = data
        .map(item => item.MonitoredVehicleJourney)
        .filter(item => (
          moment(item.MonitoredCall.ExpectedDepartureTime)
          .isBefore(moment().add(30, 'minutes'))
        ))
        .map(item => ({
          name: `${item.PublishedLineName} ${item.DestinationName}`,
          time: moment(item.MonitoredCall.ExpectedDepartureTime).format('HH:mm'),
          minutes: moment(item.MonitoredCall.ExpectedDepartureTime).diff(moment(), 'minutes')
        }));

      if (departures.length === 0) {
        res.json({
          messages: [
            {text: "Det er ingen avganger fra Kjelsås stasjon innen den neste halvtimen 😢"}
          ]
        });
      } else if (departures.length === 1) {
        const departure = departures.pop();
        res.json({
          messages: [
            {text: `Bussen ${departure.name} går om ${departure.minutes} minutter (kl ${departure.time}) fra Kjelsås stasjon 🏃`}
          ]
        });
      } else {
        const last = departures.pop();
        res.json({
          messages: [
            {text: `De neste bussavgangene fra Kjelsås stasjon er ${departures.map(item => `${item.name} kl ${item.time}`).join(', ')} og ${last.name} kl ${last.time}`}
          ]
        });
      }
    })
  },
  trikk: (res) => {
    fetch(trikkUrl)
    .then(response => response.json())
    .then(data => {
      const departures = data
        .map(item => item.MonitoredVehicleJourney)
        .filter(item => (
          moment(item.MonitoredCall.ExpectedDepartureTime)
          .isBefore(moment().add(30, 'minutes'))
        ))
        .map(item => ({
          name: `${item.PublishedLineName} ${item.DestinationName}`,
          time: moment(item.MonitoredCall.ExpectedDepartureTime).format('HH:mm'),
          minutes: moment(item.MonitoredCall.ExpectedDepartureTime).diff(moment(), 'minutes')
        }));

      if (departures.length === 0) {
        res.json({
          messages: [
            {text: "Det er ingen avganger fra Kjelsås innen den neste halvtimen 😢"}
          ]
        });
      } else if (departures.length === 1) {
        const departure = departures.pop();
        res.json({
          messages: [
            {text: `Trikken ${departure.name} går om ${departure.minutes} minutter (kl ${departure.time}) fra Kjelsås 🏃`}
          ]
        });
      } else {
        const last = departures.pop();
        res.json({
          messages: [
            {text: `De neste trikkeavgangene fra Kjelsås er ${departures.map(item => `${item.name} kl ${item.time}`).join(', ')} og ${last.name} kl ${last.time}`}
          ]
        });
      }
    })
  },
  tog: (res) => {
    fetch(togUrl)
    .then(response => response.json())
    .then(data => {
      const departures = data
        .map(item => item.MonitoredVehicleJourney)
        .filter(item => (
          moment(item.MonitoredCall.ExpectedDepartureTime)
          .isBefore(moment().add(1, 'hours'))
        ))
        .map(item => ({
          name: `${item.PublishedLineName} ${item.DestinationName}`,
          time: moment(item.MonitoredCall.ExpectedDepartureTime).format('HH:mm'),
          minutes: moment(item.MonitoredCall.ExpectedDepartureTime).diff(moment(), 'minutes')
        }));

      if (departures.length === 0) {
        res.json({
          messages: [
            {text: "Det er ingen avganger fra Kjelsås togstasjon innen den neste timen 😢"}
          ]
        });
      } else if (departures.length === 1) {
        const departure = departures.pop();
        res.json({
          messages: [
            {text: `Toget ${departure.name} går om ${departure.minutes} minutter (kl ${departure.time}) fra Kjelsås togstasjon 🏃`}
          ]
        });
      } else {
        const last = departures.pop();
        res.json({
          messages: [
            {text: `De neste togavgangene fra Kjelsås togstasjon er ${departures.map(item => `${item.name} kl ${item.time}`).join(', ')} og ${last.name} kl ${last.time}`}
          ]
        });
      }
    })
  }
}
