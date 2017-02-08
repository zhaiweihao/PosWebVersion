/*import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;*/
import React, { Component } from 'react';
import LoginPage from './pages/LoginPage';
{/*import UserTestPage from './pages/UserTestPage';*/}
import SalePage from './pages/SalePage';
import Test from './pages/Test';
import Customer from './containers/CustomerContainer';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';

import {urls} from './configs';

class App extends Component {
  render() {
    return (
      <Router history={hashHistory}>
        <Route path='/' component={ LoginPage }/>
        <Route path='/home' component={SalePage }/>
        <Route path='/test' component={Test }/>
        <Route path='/customer' component={Customer }/>
      </Router>
    );
  }
}

console.log('urls',urls);

export default App;