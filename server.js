import path from 'path';
import express from 'express';
import herokuSSLRedirect from 'heroku-ssl-redirect';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 8080;

const app = express();

const sslRedirect = herokuSSLRedirect.default;
app.use(sslRedirect());

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/ping', function (req, res) {
 return res.send('pong');
});

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port);