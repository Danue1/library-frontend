import React from 'react';
import { connect } from 'react-redux';

import BookList from '../../components/BookList';
import LibraryBook from '../../components/LibraryBook/index';
import Paginator from '../../components/Paginator';

import {
  loadPurchasedUnitItems,
  changePurchasedUnitOrder,
  changePurchasedUnitFilter,
  setPurchasedUnitId,
} from '../../services/purchased/mainUnit/actions';

import { getBooks } from '../../services/book/selectors';
import { getItemsByPage, getPageInfo, getFilterOptions } from '../../services/purchased/mainUnit/selectors';

import { toFlatten } from '../../utils/array';
import { PAGE_COUNT } from '../../constants/page';
import Responsive from '../base/Responsive';
import { URLMap } from '../../constants/urls';

class PurchasedMainUnit extends React.Component {
  static async getInitialProps({ store, query }) {
    await store.dispatch(setPurchasedUnitId(query.unitId));
    await store.dispatch(loadPurchasedUnitItems());
  }

  renderBooks() {
    const { items, books } = this.props;
    return (
      <BookList>
        {items.map(item => (
          <LibraryBook key={item.b_id} item={item} book={books[item.b_id]} />
        ))}
      </BookList>
    );
  }

  renderPaginator() {
    const {
      pageInfo: { currentPage, totalPages, orderType, orderBy, filter, unitId },
    } = this.props;

    return (
      <Paginator
        currentPage={currentPage}
        totalPages={totalPages}
        pageCount={PAGE_COUNT}
        href={URLMap.mainUnit.href}
        as={URLMap.mainUnit.as(unitId)}
        query={{ orderType, orderBy, filter }}
      />
    );
  }

  render() {
    const {
      pageInfo: { unitId },
    } = this.props;
    return (
      <>
        <div>Unit id: {unitId}</div>
        <main>
          <Responsive>
            {this.renderBooks()}
            {this.renderPaginator()}
          </Responsive>
        </main>
      </>
    );
  }
}

const mapStateToProps = state => {
  const pageInfo = getPageInfo(state);
  const filterOptions = getFilterOptions(state);
  const items = getItemsByPage(state);
  const books = getBooks(state, toFlatten(items, 'b_id'));
  return {
    pageInfo,
    filterOptions,
    items,
    books,
  };
};

const mapDispatchToProps = {
  changePurchaseOrder: changePurchasedUnitOrder,
  changePurchaseFilter: changePurchasedUnitFilter,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PurchasedMainUnit);
