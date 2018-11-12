import React from 'react';
import Link from 'next/link';
import shortid from 'shortid';
import { Icon } from '@ridi/rsg';
import classNames from 'classnames';
import * as styles from './styles';
import { calcPageBlock, makePageRange } from '../../utils/pagination';
import { snakelize } from '../../utils/snakelize';

export default class Paginator extends React.Component {
  makeHref(page) {
    const { pathname, query } = this.props;
    const _query = snakelize(query);
    return { pathname, query: { ..._query, page } };
  }

  renderGoFirst() {
    const { currentPage, pageCount } = this.props;
    if (currentPage <= pageCount) {
      return null;
    }

    return (
      <>
        <div className={styles.pageItem}>
          <Link href={this.makeHref(1)}>
            <div>처음</div>
          </Link>
        </div>
        <span className={styles.paginatorDots}>
          <Icon name="dotdotdot" className={styles.paginatorDeviderDots} />
        </span>
      </>
    );
  }

  renderGoLast() {
    const { currentPage, totalPages, pageCount } = this.props;

    if (calcPageBlock(currentPage, pageCount) === calcPageBlock(totalPages, pageCount)) {
      return null;
    }

    return (
      <>
        <span className={styles.paginatorDots}>
          <Icon name="dotdotdot" className={styles.paginatorDeviderDots} />
        </span>
        <div className={styles.pageItem}>
          <Link href={this.makeHref(totalPages)}>
            <div>마지막</div>
          </Link>
        </div>
      </>
    );
  }

  renderGoPrev() {
    const { currentPage } = this.props;

    if (currentPage === 1) {
      return null;
    }

    return (
      <div className={styles.pageItem}>
        <Link href={this.makeHref(currentPage - 1)}>
          <div>
            <Icon name="arrow_8_left" className={styles.pageItemIcon} />
          </div>
        </Link>
      </div>
    );
  }

  renderGoNext() {
    const { currentPage, totalPages } = this.props;

    if (currentPage === totalPages) {
      return null;
    }

    return (
      <div className={styles.pageItem}>
        <Link href={this.makeHref(currentPage + 1)}>
          <div>
            <Icon name="arrow_8_right" className={styles.pageItemIcon} />
          </div>
        </Link>
      </div>
    );
  }

  renderPageItems() {
    const { currentPage, totalPages, pageCount } = this.props;
    const pageRange = makePageRange(currentPage, totalPages, pageCount);
    return pageRange.map(page => (
      <li key={shortid.generate()} className={classNames(styles.pageItem, styles.pageItemGroupMember)}>
        <Link href={this.makeHref(page)}>
          <div>{page}</div>
        </Link>
      </li>
    ));
  }

  render() {
    const { totalPages } = this.props;
    if (totalPages === 1) {
      return null;
    }

    return (
      <div className={styles.paginator}>
        <div className={styles.horizontalWrapper}>
          {this.renderGoFirst()}
          {this.renderGoPrev()}
          <ul className={styles.pageItemGroup}>{this.renderPageItems()}</ul>
          {this.renderGoNext()}
          {this.renderGoLast()}
        </div>
      </div>
    );
  }
}