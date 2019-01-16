import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { initialDataState, getKey } from './state';

const getState = state => state.purchasedMainUnit;
const getDataState = state => {
  const mainUnitState = state.purchasedMainUnit;
  const key = getKey(mainUnitState);
  return mainUnitState.data[key] || initialDataState;
};

export const getItems = createSelector(
  getDataState,
  dataState => dataState.items,
);

export const getPageInfo = createSelector(
  [getState, getDataState],
  (state, dataState) => {
    const { unitId, order } = state;
    const { page, itemTotalCount } = dataState;

    // TODO: Series 혹은 Collection 정렬 옵션 사용하기
    const { orderType, orderBy } = MainOrderOptions.parse(order);

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(itemTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
      order,
      orderType,
      orderBy,
    };
  },
);

export const getUnitId = createSelector(
  getState,
  state => state.unitId,
);

export const getPage = createSelector(
  getDataState,
  dataState => dataState.page,
);

export const getOrder = createSelector(
  getState,
  state => state.order,
);

export const getOptions = createSelector(
  [getUnitId, getPage, getOrder],
  (unitId, page, order) => ({
    unitId,
    page,
    order,
  }),
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);

export const getTotalCount = createSelector(
  getDataState,
  dataState => ({ itemTotalCount: dataState.itemTotalCount }),
);

export const getIsFetchingBook = createSelector(
  getState,
  state => state.isFetchingBook,
);
