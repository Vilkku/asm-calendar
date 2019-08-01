import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchEvents (action) {
  const events = yield call(axios.get, 'https://vilkku.kapsi.fi/asm/proxy.php');
  yield put({type: 'RECEIVE_EVENTS', data: events.data});
}

function* eventsSaga () {
  yield takeLatest('REQUEST_EVENTS', fetchEvents);
}

export default eventsSaga;
