import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reduxThunk from "redux-thunk";

import storeReducer from './reducers.js'
import App from './App'

const store = createStore(storeReducer, composeWithDevTools(
  applyMiddleware(reduxThunk)
));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>,
  </React.StrictMode>,
  document.getElementById('root')
);
