const express = require('express');
const yr = require('./yr.js');
const fotball = require('./fotball.js');
const ruter = require('./ruter.js');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
  res.json({
    messages: [
      {text: "Dette er en svarmelding!"}
    ]
  });
});
// dette er en test;

app.get('/yr/idag', (req, res) => {
  yr(res);
});

app.get('/yr/imorgen', (req, res) => {
  yr(res, true);
});

app.get('/fotball', (req, res) => {
  if (req.query.lag) {
    fotball(res, req.query.lag);
  } else {
    fotball(res);
  }
});

app.get('/ruter/buss', (req, res) => {
  ruter.buss(res);
});

app.get('/ruter/trikk', (req, res) => {
  ruter.trikk(res);
});

app.get('/ruter/tog', (req, res) => {
  ruter.tog(res);
});

app.listen(app.get('port'), () => {
  console.log('Tenkbot-API is running on port', app.get('port'));
});