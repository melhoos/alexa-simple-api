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
                {text: `There are no departures from ${stopData.Name} station the next half hour`}
            ]
            });
        } else if (departures.length === 1) {
            const departure = departures.pop();
            res.json({
            messages: [
                {text: `Departure from ${stopData.Name} in ${departure.minutes} minutes at ${departure.time} o'clock`}
            ]
            });
        } else {
            const last = departures.pop();
            res.json({
            messages: [
                {text: `Nex departures from ${stopData.Name} station are ${departures.map(item => `${item.name} ${item.time} o'clock`).join(', ')} and ${last.name} ${last.time} o'clock`}
            ]
            });
        }
    });
}
