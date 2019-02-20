import React from 'react';
import express from 'express';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import App from './App';
import rootReducer from './reducer';

const assets = require(process.env.SHINOBI_ASSETS_MANIFEST);

const renderToHtml = (markup, preloadedState) =>
  `<!doctype html>
    <html lang="">
      <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Shinobi</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ''
        }
        ${
          process.env.NODE_ENV === 'production'
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
      </head>
      <body>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
            /</g,
            '\\u003c'
          )}
        </script>
        <div id="root">${markup}</div>
      </body>
    </html>`;

const server = express();
server
  .disable('x-powered-by')
  .use(express.static(process.env.SHINOBI_PUBLIC_DIR))
  .get('/*', (req, res) => {
    const context = {};
    const store = createStore(rootReducer);
    const markup = renderToString(
      <Provider store={store}>
        <App />
      </Provider>,
    );
    const preloadedState = store.getState();

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(renderToHtml(markup, preloadedState));
    }
  });

export default server;
