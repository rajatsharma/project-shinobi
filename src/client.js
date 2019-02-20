import React from 'react';
import { hydrate } from 'react-dom';
import { createStore } from 'redux'
import { Provider } from 'react-redux'

import App from './App';
import rootReducer from './reducer'

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__ // eslint-disable-line

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__ // eslint-disable-line

const store = createStore(rootReducer, preloadedState)

hydrate(
  <Provider store={store} >
    <App />
  </Provider>,
  document.getElementById('root'));

if (module.hot) {
  module.hot.accept();
}
