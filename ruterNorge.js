const fetch = require('node-fetch');
const moment = require('moment');

const baseUrl = 'https://reisapi.ruter.no/StopVisit/GetDepartures/';
const stopUrl = 'https://reisapi.ruter.no/Place/GetStop/';

moment.locale('nb');

module.exports = (res, id) => {
    var getStop = fetch(stopUrl+id).then(function(response){ 
        return response.json()
    });
    var getDepartures = fetch(baseUrl+id).then(function(response){
        return response.json()
    });

    Promise.all([getStop, getDepartures]).then(function(values){
        const stopData = values[0];
        const departureData = values[1];

        const departures = departureData
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
                {text: `Det er ingen avganger fra ${stopData.Name} stasjon innen den neste halvtimen 😢`}
            ]
            });
        } else if (departures.length === 1) {
            const departure = departures.pop();
            res.json({
            messages: [
                {text: `Avgang fra ${stopData.Name} går om ${departure.minutes} minutter (kl ${departure.time}) 🏃`}
            ]
            });
        } else {
            const last = departures.pop();
            res.json({
            messages: [
                {text: `De neste avgangene fra ${stopData.Name} stasjon er ${departures.map(item => `${item.name} kl ${item.time}`).join(', ')} og ${last.name} kl ${last.time}`}
            ]
            });
        }
    });
}
