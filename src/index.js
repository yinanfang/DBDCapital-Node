import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';

import { createStore } from 'redux';
import App from './App.js';
import counter from './reducers';
// import configureStore from './store/configureStore'
// import 'todomvc-app-css/index.css'

// const store = configureStore()


ReactDOM.render(
  <App />,
  document.getElementById('root')
);
