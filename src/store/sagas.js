import { all } from 'redux-saga/effects';

import commonRootSaga from '../services/common/sagas';
import accountRootSaga from '../services/account/sagas';
import bookRootSaga from '../services/book/sagas';
import bookDownloadRootSaga from '../services/bookDownload/sagas';
import excelDownloadRootSaga from '../services/excelDownload/sagas';

import purchasedCommonRootSaga from '../services/purchased/common/sagas/rootSagas';
import purchasedMainRootSaga from '../services/purchased/main/sagas';
import purchasedMainUnitRootSaga from '../services/purchased/mainUnit/sagas';
import purchasedSearchRootSaga from '../services/purchased/search/sagas';
import purchasedSearchUnitRootSaga from '../services/purchased/searchUnit/sagas';
import purchasedHiddenSaga from '../services/purchased/hidden/sagas';
import purchaseHiddenUnitRootSaga from '../services/purchased/hiddenUnit/sagas';
import serialPreferenceRootSaga from '../services/serialPreference/sagas';

import toastRootSaga from '../services/toast/sagas';

export default function* rootSaga() {
  yield all([
    commonRootSaga(),
    accountRootSaga(),
    bookRootSaga(),
    excelDownloadRootSaga(),
    purchasedCommonRootSaga(),
    purchasedMainRootSaga(),
    purchasedMainUnitRootSaga(),
    purchasedSearchRootSaga(),
    purchasedSearchUnitRootSaga(),
    purchasedHiddenSaga(),
    purchaseHiddenUnitRootSaga(),
    serialPreferenceRootSaga(),
    toastRootSaga(),
    bookDownloadRootSaga(),
  ]);
}
