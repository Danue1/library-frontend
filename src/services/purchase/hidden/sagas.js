import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  LOAD_PURCHASE_HIDDEN_ITEMS,
  setPurchaseHiddenItems,
  setPurchaseHiddenPage,
  setPurchaseHiddenTotalCount,
} from './actions';
import { getQuery } from '../../router/selectors';
import { loadBookData } from '../../book/sagas';
import { fetchPurchasedHiddenItems, fetchPurchasedHiddenItemsTotalCount } from './requests';

const getBookIdsFromItems = items => items.map(item => item.b_id);

function* loadPurchaseHiddenItems() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;
  yield put(setPurchaseHiddenPage(page));

  const [itemResponse, countResponse] = yield all([
    call(fetchPurchasedHiddenItems, page),
    call(fetchPurchasedHiddenItemsTotalCount),
  ]);
  const bookIds = getBookIdsFromItems(itemResponse.items);
  yield call(loadBookData, bookIds);
  yield all([
    put(setPurchaseHiddenItems(itemResponse.items)),
    put(setPurchaseHiddenTotalCount(countResponse.item_total_count)),
  ]);
}

export default function* purchaseHiddenRootSaga() {
  yield takeEvery(LOAD_PURCHASE_HIDDEN_ITEMS, loadPurchaseHiddenItems);
}
