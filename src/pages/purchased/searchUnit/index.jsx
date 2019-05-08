/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { connect } from 'react-redux';
import { URLMap, PageType } from '../../../constants/urls';
import { getSearchPageInfo } from '../../../services/purchased/search/selectors';
import {
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  setUnitId,
} from '../../../services/purchased/searchUnit/actions';
import { clearSelectedBooks } from '../../../services/selection/actions';
import {
  getIsFetchingBook,
  getItemsByPage,
  getPageInfo,
  getTotalCount,
  getUnitId,
  getPrimaryItem,
} from '../../../services/purchased/searchUnit/selectors';
import { getPrimaryBookId } from '../../../services/purchased/common/selectors';
import UnitPageTemplate from '../../base/UnitPageTemplate';

class searchUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setUnitId(query.unit_id));
    await store.dispatch(clearSelectedBooks());
    await store.dispatch(loadItems());
  }

  render() {
    return <UnitPageTemplate {...this.props} />;
  }
}

const mapStateToProps = state => {
  const unitId = getUnitId(state);
  const primaryBookId = getPrimaryBookId(state, unitId);
  const primaryItem = getPrimaryItem(state);
  const items = getItemsByPage(state);

  const totalCount = getTotalCount(state);
  const isFetchingBook = getIsFetchingBook(state);

  const pageInfo = getPageInfo(state);
  const searchPageInfo = getSearchPageInfo(state);

  return {
    items,
    unitId,
    primaryBookId,
    primaryItem,
    totalCount,
    isFetchingBook,

    pageInfo,
    searchPageInfo,

    isError: state.ui.isError,
  };
};

const mapDispatchToProps = {
  dispatchLoadItems: loadItems,
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

const mergeProps = (state, actions, props) => {
  const {
    unitId,
    pageInfo: { keyword, currentPage, totalPages, orderType, orderBy },
    searchPageInfo,
  } = state;

  const pageProps = {
    currentPage,
    totalPages,
    href: { pathname: URLMap[PageType.SEARCH_UNIT].href, query: { unitId, keyword } },
    as: { pathname: URLMap[PageType.SEARCH_UNIT].as({ unitId }), query: { keyword } },
    query: { orderType, orderBy },
  };

  const backPageProps = {
    href: URLMap[PageType.SEARCH].href,
    as: URLMap[PageType.SEARCH].as,
    query: { keyword, page: searchPageInfo.currentPage },
  };

  return {
    ...state,
    ...actions,
    ...props,
    pageProps,
    backPageProps,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(searchUnit);
