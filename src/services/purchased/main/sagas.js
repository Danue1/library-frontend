import { all, call, put, select, takeEvery } from 'redux-saga/effects';

import {
  DOWNLOAD_SELECTED_MAIN_BOOKS,
  HIDE_SELECTED_MAIN_BOOKS,
  LOAD_MAIN_ITEMS,
  SELECT_ALL_MAIN_BOOKS,
  setFilter,
  setFilterOptions,
  setItems,
  setOrder,
  setPage,
  setTotalCount,
  selectBooks,
  setIsFetchingBooks,
} from './actions';
import { showToast } from '../../toast/actions';
import { fetchMainItems, fetchMainItemsTotalCount, fetchPurchaseCategories } from './requests';

import { MainOrderOptions } from '../../../constants/orderOptions';
import { toFlatten } from '../../../utils/array';

import { getQuery } from '../../router/selectors';
import { getItems, getItemsByPage, getOptions, getSelectedBooks } from './selectors';

import { loadBookData, extractUnitData } from '../../book/sagas';
import { getRevision, requestCheckQueueStatus, requestHide } from '../../common/requests';
import { getBookIdsByItems } from '../../common/sagas';
import { downloadBooks } from '../../bookDownload/sagas';
import { setFullScreenLoading } from '../../fullScreenLoading/actions';

function* persistPageOptionsFromQueries() {
  const query = yield select(getQuery);
  const page = parseInt(query.page, 10) || 1;

  const { order_type: orderType = MainOrderOptions.DEFAULT.orderType, order_by: orderBy = MainOrderOptions.DEFAULT.orderBy } = query;
  const order = MainOrderOptions.toIndex(orderType, orderBy);
  const filter = parseInt(query.filter, 10) || null;

  yield all([put(setPage(page)), put(setOrder(order)), put(setFilter(filter))]);
}

function* loadMainItems() {
  yield call(persistPageOptionsFromQueries);

  const { page, order, filter: category } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);

  yield put(setIsFetchingBooks(true));
  const [itemResponse, countResponse, categories] = yield all([
    call(fetchMainItems, orderType, orderBy, category, page),
    call(fetchMainItemsTotalCount, orderType, orderBy, category),
    call(fetchPurchaseCategories),
  ]);

  yield call(extractUnitData, itemResponse.items);

  // Request BookData
  const bookIds = toFlatten(itemResponse.items, 'b_id');
  yield call(loadBookData, bookIds);
  yield all([
    put(setItems(itemResponse.items)),
    put(setTotalCount(countResponse.unit_total_count, countResponse.item_total_count)),
    put(setFilterOptions(categories)),
  ]);
  yield put(setIsFetchingBooks(false));
}

function* hideSelectedBooks() {
  yield put(setFullScreenLoading(true));
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);
  const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);

  const revision = yield call(getRevision);
  const queueIds = yield call(requestHide, bookIds, revision);

  const isFinish = yield call(requestCheckQueueStatus, queueIds);
  if (isFinish) {
    yield call(loadMainItems);
  }

  // TODO 메시지 수정
  yield all([put(showToast(isFinish ? '큐 반영 완료' : '잠시후 반영 됩니다.')), put(setFullScreenLoading(false))]);
}

function* downloadSelectedBooks() {
  const items = yield select(getItems);
  const selectedBooks = yield select(getSelectedBooks);

  const { order } = yield select(getOptions);
  const { orderType, orderBy } = MainOrderOptions.parse(order);
  const bookIds = yield call(getBookIdsByItems, items, Object.keys(selectedBooks), orderType, orderBy);

  yield call(downloadBooks, bookIds);
}

function* selectAllBooks() {
  const items = yield select(getItemsByPage);
  const bookIds = toFlatten(items, 'b_id');
  yield put(selectBooks(bookIds));
}

export default function* purchaseMainRootSaga() {
  yield all([
    takeEvery(LOAD_MAIN_ITEMS, loadMainItems),
    takeEvery(HIDE_SELECTED_MAIN_BOOKS, hideSelectedBooks),
    takeEvery(DOWNLOAD_SELECTED_MAIN_BOOKS, downloadSelectedBooks),
    takeEvery(SELECT_ALL_MAIN_BOOKS, selectAllBooks),
  ]);
}
