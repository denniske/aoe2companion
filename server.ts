#!/usr/bin/env node

const path = require('path');
const { createRequestHandler } = require('expo-server/adapter/express');

const express = require('express');
const compression = require('compression');
const morgan = require('morgan');

const CLIENT_BUILD_DIR = path.join(process.cwd(), 'dist/client');
const SERVER_BUILD_DIR = path.join(process.cwd(), 'dist/server');

process.env.NODE_ENV = 'production';

const app = express();

app.use(compression());

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Before the www redirect below, deliberately. A proxy health-checks the container directly, so
// the Host is the container id -- which matches neither exemption and would be redirected to
// https://www.<container-id>, a name that cannot resolve. The checker follows the redirect and
// fails on DNS, so the container never becomes healthy and the deploy times out with the app
// itself running perfectly. A health endpoint must answer, not redirect.
app.get('/ready', (req: any, res: any) => {
    res.status(200).type('text/plain').send('Ready.');
});

app.use((req: any, res: any, next: any) => {
    const host = req.headers.host;
    if (host && !host.startsWith('www.') && !host.includes('app.')) {
        return res.redirect(301, `https://www.${host}${req.url}`);
    }
    next();
});

app.use(
  express.static(CLIENT_BUILD_DIR, {
    maxAge: '1h',
    extensions: ['html'],
    // Serve dot-directories like /.well-known/ (Express ignores them by default),
    // required for Apple universal links (apple-app-site-association).
    dotfiles: 'allow',
  })
);

app.use(morgan('tiny'));

app.all(
  '/{*all}',
  createRequestHandler({
    build: SERVER_BUILD_DIR,
  })
);
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
