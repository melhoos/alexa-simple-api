const fetch = require('node-fetch');
const xml2json = require('xml2json');

const yrBaseURL = 'http://www.yr.no/sted';

module.exports = (res, imorgen, land, fylke, komune, by) => {
  fetch(yrBaseURL + '/' + land + '/' + fylke + '/' + komune + '/' + by + '/varsel.xml')
  .then(response => response.text())
  .then(response => JSON.parse(xml2json.toJson(response)))
  .then(data => {
    const perioder = data.weatherdata.forecast.tabular.time;
    if (imorgen) {
      let subset = perioder;
      while (subset[0].period !== "0") {
        subset.shift();
      }
      return subset.slice(0,4);
    }
    return perioder.slice(0,2);
  })
  .then(perioder =>
    perioder.reduce((sum, periode) => sum + Number(periode.precipitation.value), 0)
  )
  .then(precipitation => {
    if (precipitation < 1) {
      res.json({
        messages: [
          {text: "Ser ut til å bli fint vær! ☀️"}
        ]
      });
    } else if (precipitation >=1 && precipitation < 3) {
      res.json({
        messages: [
          {text: `Kan være greit å ha med paraply i ${imorgen ? 'morgen' : 'dag'}, det ser ut til at det skal regne litt! ☔`}
        ]
      });
    } else if (precipitation > 3) {
      res.json({
        messages: [
          {text: `Ta frem allværsjakken og paraplyen, i ${imorgen ? 'morgen' : 'dag'} blir det regnvær! ☔`}
        ]
      });
    }
  });
}
