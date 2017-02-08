/*import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);*/

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import SalePage from './pages/SalePage';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import reducer from './reducers';
import { LOGIN_SUCCESS } from './constants/ActionTypes';
import { createAction } from 'redux-actions';
import './index.css';

const finalCreateStore = applyMiddleware(thunk)(createStore);
let store = finalCreateStore(reducer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
