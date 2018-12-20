import { createSelector } from 'reselect';

import { LIBRARY_ITEMS_LIMIT_PER_PAGE } from '../../../constants/page';
import { calcPage } from '../../../utils/pagination';

const getState = state => state.purchasedHiddenUnit;

export const getItemsByPage = createSelector(
  getState,
  state => {
    const { page, itemIdsForPage, items } = state;
    const itemIds = itemIdsForPage[page] || [];
    return itemIds.map(itemId => items[itemId]);
  },
);

export const getPageInfo = createSelector(
  getState,
  state => {
    const { unitId, page, unitTotalCount } = state;

    return {
      unitId,
      currentPage: page,
      totalPages: calcPage(unitTotalCount, LIBRARY_ITEMS_LIMIT_PER_PAGE),
    };
  },
);

export const getUnitId = createSelector(
  getState,
  state => state.unitId,
);

export const getPage = createSelector(
  getState,
  state => state.page,
);

export const getOptions = createSelector(
  [getUnitId, getPage],
  (unitId, page) => ({
    unitId,
    page,
  }),
);

export const getItemTotalCount = createSelector(
  getState,
  state => state.itemTotalCount,
);

export const getSelectedBooks = createSelector(
  getState,
  state => state.selectedBooks,
);
