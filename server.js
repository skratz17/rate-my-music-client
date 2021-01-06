const express = require('express');
const path = require('path');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('.well-known/acme-challenge/u7oRDF-jDpHOZpjKTAZzy2b2IMul7k7wWsJZtRTVDXY', (req, res) => {
  res.send('u7oRDF-jDpHOZpjKTAZzy2b2IMul7k7wWsJZtRTVDXY.cFynvrW8PUzFicpFbiOxmyOej8qARygHVlGVcSyLUoI');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);