const express = require('express');
const path = require('path');

const port = process.env.PORT || 8080;

const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/.well-known/acme-challenge/atWFQxrrF5FxzIzyLOU3jlJUw0thZhKAXQA4xR87Jv0', (req, res) => {
  res.send('atWFQxrrF5FxzIzyLOU3jlJUw0thZhKAXQA4xR87Jv0.cFynvrW8PUzFicpFbiOxmyOej8qARygHVlGVcSyLUoI');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);