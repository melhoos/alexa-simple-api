const fetch = require('node-fetch');
const moment = require('moment');

const baseUrl = 'https://reisapi.ruter.no/StopVisit/GetDepartures/';

moment.locale('nb');

module.exports = (res, id) => {
    fetch(baseUrl + id)
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
        const departure = departures.pop();
        res.json({
          messages: [
            {text: `Det er ingen avganger fra ${departure.name} stasjon innen den neste halvtimen 😢`}
          ]
        });
      } else if (departures.length === 1) {
        const departure = departures.pop();
        res.json({
          messages: [
            {text: `Bussen ${departure.name} går om ${departure.minutes} minutter (kl ${departure.time}) fra ${departure.name} stasjon 🏃`}
          ]
        });
      } else {
        const last = departures.pop();
        res.json({
          messages: [
            {text: `De neste avgangene fra ${departures.name} stasjon er ${departures.map(item => `${item.name} kl ${item.time}`).join(', ')} og ${last.name} kl ${last.time}`}
          ]
        });
      }
    })
}
