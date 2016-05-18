// import 'babel-polyfill'
import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import App from './App.js';
// import configureStore from './store/configureStore'
// import 'todomvc-app-css/index.css'

// const store = configureStore()

ReactDOM.render(
  <App />,
  document.getElementById('root')
);



// render(
//   <Provider>
//     <div></div>
//   </Provider>,
//   document.getElementById('root')
// );



// render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('root')
// )
