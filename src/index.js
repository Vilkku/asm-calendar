import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import {IntlProvider} from 'react-intl';

ReactDOM.render(
  <IntlProvider locale='en-GB'>
    <App />
  </IntlProvider>,
  document.getElementById('root')
);
