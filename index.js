const express = require('express');
const yrOslo = require('./yr.js');
const yrNorge = require('./yrNorge.js');
const yrUtland = require('./yrUtland.js');
const fotball = require('./fotball.js');
const ruterKjelsas = require('./ruterKjelsas.js');
const ruterNorge = require('./ruterNorge.js');

const app = express();

app.set('port', (process.env.PORT || 5000));

app.get('/', (req, res) => {
  res.json({
    messages: [
      {text: "Dette er en svarmelding!"}
    ]
  });
});

app.get('/yr/idag', (req, res) => {
  yrOslo(res);
});

app.get('/yr/imorgen', (req, res) => {
  yrOslo(res, true);
});

app.get('/yr/:land/:stat/:by/', (req, res) => {
  yrUtland(res, false, req.params.land, req.params.stat, req.params.by);
});

app.get('/yr/:land/:stat/:by/idag', (req, res) => {
  yrUtland(res, false, req.params.land, req.params.stat, req.params.by);
});

app.get('/yr/:land/:stat/:by/imorgen', (req, res) => {
  yrUtland(res, true, req.params.land, req.params.stat, req.params.by);
});

app.get('/yr/:land/:fylke/:kommune/:by', (req, res) => {
  yrNorge(res, false, req.params.land, req.params.fylke, req.params.kommune, req.params.by);
});

app.get('/yr/:land/:fylke/:kommune/:by/imorgen', (req, res) => {
  yrNorge(res, true, req.params.land, req.params.fylke, req.params.kommune, req.params.by);
});

app.get('/yr/:land/:fylke/:komune/:by/idag', (req, res) => {
  yrNorge(res, false, req.params.land, req.params.fylke, req.params.komune, req.params.by);
});

app.get('/fotball', (req, res) => {
  if (req.query.lag) {
    fotball(res, req.query.lag);
  } else {
    fotball(res);
  }
});

app.get('/ruter/buss', (req, res) => {
  ruterKjelsas.buss(res);
});

app.get('/ruter/trikk', (req, res) => {
  ruterKjelsas.trikk(res);
});

app.get('/ruter/tog', (req, res) => {
  ruterKjelsas.tog(res);
});

app.get('test/id/:id', (req, res) => {
  ruterNorge(res, req.params.id);
});

app.listen(app.get('port'), () => {
  console.log('Tenkbot-API is running on port', app.get('port'));
});