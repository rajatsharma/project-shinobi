import { call, put, takeLatest } from 'redux-saga/effects' //eslint-disable-line
import { delay } from 'redux-saga'
import actionSpreader from '../utils/actionspreader'

export function * asyncCounter () {
  yield call(delay, 2000)
  yield put(actionSpreader('HIDETOAST'))
}

export function * rootSaga () {
  yield takeLatest('SHOWTOAST', asyncCounter)
}

export default rootSaga
