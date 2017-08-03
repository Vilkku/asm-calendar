import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga'
import reducer from './reducers';
import App from './App';
import {IntlProvider} from 'react-intl';
import { fetchEvents, selectLocations, selectMajorOnly } from './actions/events';
import eventsSaga from './sagas/events';
import storage from 'store/dist/store.modern';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(eventsSaga);

store.subscribe(() => {
  console.log(store.getState());
});

store.dispatch(fetchEvents());

if (storage.get('locations')) {
  store.dispatch(selectLocations(storage.get('locations')));
}

if (storage.get('majorOnly')) {
  console.log(storage.get('majorOnly'));
  store.dispatch(selectMajorOnly(storage.get('majorOnly')));
}

render(
  <IntlProvider locale='en-GB'>
    <Provider store={store}>
      <App />
    </Provider>
  </IntlProvider>,
  document.getElementById('root')
);
