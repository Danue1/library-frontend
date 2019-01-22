/** @jsx jsx */
import { jsx } from '@emotion/core';
import Head from 'next/head';
import Router from 'next/router';
import React from 'react';
import { connect } from 'react-redux';
import BookList from '../../../components/BookList';
import EmptyBookList from '../../../components/EmptyBookList';
import LibraryBook from '../../../components/LibraryBook';
import ResponsivePaginator from '../../../components/ResponsivePaginator';
import SkeletonBookList from '../../../components/Skeleton/SkeletonBookList';
import { MainOrderOptions } from '../../../constants/orderOptions';
import { URLMap } from '../../../constants/urls';
import { getBooks } from '../../../services/book/selectors';
import {
  clearSelectedBooks,
  downloadSelectedBooks,
  hideSelectedBooks,
  loadItems,
  selectAllBooks,
  toggleSelectBook,
} from '../../../services/purchased/main/actions';
import {
  getFilterOptions,
  getIsFetchingBooks,
  getItemsByPage,
  getPageInfo,
  getSelectedBooks,
} from '../../../services/purchased/main/selectors';
import { toFlatten } from '../../../utils/array';
import { makeLinkProps, makeURI } from '../../../utils/uri';
import { TabBar, TabMenuTypes } from '../../base/LNB';
import FilterModal from '../../base/Modal/FilterModal';
import SortModal from '../../base/Modal/SortModal';
import Responsive from '../../base/Responsive';
import * as styles from './styles';
import SearchBar from '../../../components/SearchBar';
import Editable from '../../../components/Editable';

class Main extends React.Component {
  static async getInitialProps({ store }) {
    await store.dispatch(loadItems());
  }

  constructor(props) {
    super(props);

    this.state = {
      isEditing: false,
      showMoreModal: false,
      showFilterModal: false,
      hideTools: false,
    };
  }

  toggleEditingMode = () => {
    const { isEditing } = this.state;
    const { dispatchClearSelectedBooks } = this.props;

    if (isEditing === true) {
      dispatchClearSelectedBooks();
    }

    this.setState({ isEditing: !isEditing, showFilterModal: false, showMoreModal: false });
  };

  toggleFilterModal = () => {
    const { showFilterModal } = this.state;
    this.setState({ showFilterModal: !showFilterModal, showMoreModal: false });
  };

  toggleMoreModal = () => {
    const { showMoreModal } = this.state;
    this.setState({ showMoreModal: !showMoreModal, showFilterModal: false });
  };

  handleOnClickOutOfModal = () => {
    this.setState({ showMoreModal: false, showFilterModal: false });
  };

  handleOnSubmitSearchBar = value => {
    const { href, as } = URLMap.search;
    Router.push(makeURI(href, { keyword: value }), makeURI(as, { keyword: value }));
  };

  handleOnFocusSearchBar = () => {
    this.setState({
      hideTools: true,
      showFilterModal: false,
      showMoreModal: false,
    });
  };

  handleOnBlurSearchBar = () => {
    this.setState({
      hideTools: false,
      showFilterModal: false,
      showMoreModal: false,
    });
  };

  handleOnClickHide = () => {
    const { dispatchHideSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchHideSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  handleOnClickDownload = () => {
    const { dispatchDownloadSelectedBooks, dispatchClearSelectedBooks } = this.props;

    dispatchDownloadSelectedBooks();
    dispatchClearSelectedBooks();
    this.setState({ isEditing: false });
  };

  makeEditingBarProps() {
    const { items, selectedBooks, dispatchSelectAllBooks, dispatchClearSelectedBooks } = this.props;
    const totalSelectedCount = Object.keys(selectedBooks).length;
    const isSelectedAllBooks = totalSelectedCount === items.length;

    return {
      totalSelectedCount,
      isSelectedAllBooks,
      onClickSelectAllBooks: dispatchSelectAllBooks,
      onClickUnselectAllBooks: dispatchClearSelectedBooks,
      onClickSuccessButton: this.toggleEditingMode,
    };
  }

  makeActionBarProps() {
    const { selectedBooks } = this.props;
    const disable = Object.keys(selectedBooks).length === 0;

    return {
      buttonsProps: [
        {
          name: '선택 숨기기',
          onClick: this.handleOnClickHide,
          disable,
        },
        {
          name: '선택 다운로드',
          onClick: this.handleOnClickDownload,
          disable,
        },
      ],
    };
  }

  renderSearchBar() {
    const { hideTools } = this.state;

    const searchBarProps = {
      hideTools,
      handleOnSubmitSearchBar: this.handleOnSubmitSearchBar,
      handleOnFocusSearchBar: this.handleOnFocusSearchBar,
      handleOnBlurSearchBar: this.handleOnBlurSearchBar,
      filter: true,
      toggleFilterModal: this.toggleFilterModal,
      edit: true,
      toggleEditingMode: this.toggleEditingMode,
      more: true,
      toggleMoreModal: this.toggleMoreModal,
    };

    return <SearchBar {...searchBarProps} />;
  }

  renderModal() {
    const { showFilterModal, showMoreModal } = this.state;
    const {
      pageInfo: { order, orderType, orderBy, filter },
      filterOptions,
    } = this.props;

    return (
      <>
        <FilterModal
          filter={filter}
          filterOptions={filterOptions}
          query={{ orderType, orderBy }}
          isActive={showFilterModal}
          onClickModalBackground={this.handleOnClickOutOfModal}
        />
        <SortModal
          order={order}
          orderOptions={MainOrderOptions.toList()}
          query={{ filter }}
          isActive={showMoreModal}
          onClickModalBackground={this.handleOnClickOutOfModal}
        />
      </>
    );
  }

  renderBooks() {
    const { isEditing } = this.state;
    const { items, books, selectedBooks, dispatchToggleSelectBook } = this.props;

    if (items.length === 0) {
      return <EmptyBookList message="구매/대여하신 책이 없습니다." />;
    }

    return (
      <BookList>
        {items.map(item => (
          <LibraryBook
            key={item.b_id}
            item={item}
            book={books[item.b_id]}
            isEditing={isEditing}
            checked={!!selectedBooks[item.b_id]}
            onChangeCheckbox={() => dispatchToggleSelectBook(item.b_id)}
            {...makeLinkProps({ pathname: URLMap.mainUnit.href, query: { unitId: item.unit_id } }, URLMap.mainUnit.as(item.unit_id))}
          />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { orderType, orderBy, filter, currentPage, totalPages },
    } = this.props;

    return (
      <ResponsivePaginator
        currentPage={currentPage}
        totalPages={totalPages}
        href={URLMap.main.href}
        as={URLMap.main.as}
        query={{ orderType, orderBy, filter }}
      />
    );
  }

  render() {
    const { isEditing } = this.state;
    const { items, isFetchingBooks } = this.props;
    const showSkeleton = isFetchingBooks && items.length === 0;

    return (
      <>
        <Head>
          <title>모든 책 - 내 서재</title>
        </Head>
        <TabBar activeMenu={TabMenuTypes.ALL_BOOKS} />
        <Editable
          isEditing={isEditing}
          nonEditBar={this.renderSearchBar()}
          editingBarProps={this.makeEditingBarProps()}
          actionBarProps={this.makeActionBarProps()}
        >
          <main css={showSkeleton && styles.mainFetchingBooks}>
            <Responsive>
              {showSkeleton ? (
                <SkeletonBookList />
              ) : (
                <>
                  {this.renderBooks()}
                  {this.renderPaginator()}
                </>
              )}
              {this.renderModal()}
            </Responsive>
          </main>
        </Editable>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  const selectedBooks = getSelectedBooks(state);
  const isFetchingBooks = getIsFetchingBooks(state);

  return {
    pageInfo,
    filterOptions,
    items,
    books,
    selectedBooks,
    isFetchingBooks,
  };
};

const mapDispatchToProps = {
  dispatchSelectAllBooks: selectAllBooks,
  dispatchClearSelectedBooks: clearSelectedBooks,
  dispatchToggleSelectBook: toggleSelectBook,
  dispatchHideSelectedBooks: hideSelectedBooks,
  dispatchDownloadSelectedBooks: downloadSelectedBooks,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main);
