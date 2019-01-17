/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/core';

import AuthorRole from '../constants/authorRole';
import { UnitType } from '../constants/unitType';
import { BookFileType } from '../services/book/constants';
import { Responsive } from '../styles/responsive';
import { formatFileSize } from '../utils/file';
import { numberWithUnit } from '../utils/number';
import Expander from './expander';
import { TextTruncate } from './TextTruncate';

const styles = {
  detailView: css({
    display: 'flex',
    flexDirection: 'column',

    marginTop: 28,

    ...Responsive.Pc({
      marginTop: 50,
      flexDirection: 'row',
    }),

    ...Responsive.W1280({
      marginLeft: 100,
    }),
  }),

  wrapper: css({
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  thumbnailWrapper: css({}),
  thumbnail: css({
    backgroundImage: 'linear-gradient(to left, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.0) 6%, rgba(0, 0, 0, 0.0) 94%, rgba(0, 0, 0, 0.2))',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    width: 130,

    ...Responsive.Pc({
      width: 180,
    }),
  }),
  ridibooksLink: css({
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#1f8ce6',
    marginTop: 16,
  }),

  infoWrapper: css({
    marginTop: 24,

    alignItems: 'start',
    justifyContent: 'left',

    ...Responsive.Pc({
      marginTop: 48,
      marginLeft: 40,
    }),
  }),
  unitTitle: css({
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 1.54,
    letterSpacing: -0.4,
    color: '#212529',

    ...Responsive.Pc({
      fontSize: 30,
      fontWeight: 'bold',
      lineHeight: 1.03,
      letterSpacing: -0.6,
      color: '#212529',
    }),
  }),
  authorList: css({
    marginTop: 8,
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#40474d',

    ...Responsive.Pc({
      marginTop: 16,
    }),
  }),
  bookDescription: css({
    marginTop: 8,
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#40474d',
    clear: 'both',

    ...Responsive.Pc({
      marginTop: 16,
    }),
  }),
  bookDescriptionTitle: css({
    fontWeight: 'bold',
    letterSpacing: -0.28,
    lineHeight: 'normal',
  }),
  bookDescriptionBody: css({
    marginTop: 9,
    lineHeight: 1.5,
  }),
  downloadButton: css({
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    borderRadius: 4,
    boxShadow: '1px 1px 1px 0 rgba(31, 140, 230, 0.3)',
    backgroundColor: '#1f8ce6',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -0.7,

    ...Responsive.Pc({
      width: 250,
    }),
  }),
  drmFreeDownloadButton: css({
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
    height: 50,
    borderRadius: 4,
    boxShadow: '1px 1px 1px 0 rgba(209, 213, 217, 0.3)',
    backgroundColor: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#808991',
    letterSpacing: -0.7,

    ...Responsive.Pc({
      width: 250,
    }),
  }),
  fileInfo: css({
    marginTop: 24,
    marginBottom: 10,
    fontSize: 15,
    letterSpacing: -0.3,
    color: '#808991',
  }),
  fileInfoText: css({
    float: 'left',
  }),
  fileInfoDelimiter: css({
    width: 1,
    height: 9,
    marginTop: 5,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: '#d1d5d9',
    float: 'left',
  }),
};

class UnitDetailView extends React.Component {
  compileAuthors() {
    const {
      book: { authors },
    } = this.props;
    const roles = AuthorRole.getPriorities(authors);

    return roles
      .reduce((previous, role) => {
        const author = authors[role];

        if (author) {
          const names = author.map(value => value.name).join(',');
          previous.push(`${names} ${AuthorRole.convertToString(role)}`);
        }
        return previous;
      }, [])
      .join(' | ');
  }

  renderFileInfo() {
    const { book } = this.props;

    // info의 text 에 | 와 \ 사용되면 안된다. 두개의 문자는 예약어이다.
    const infos = [];

    if (book.file.format !== BookFileType.BOM) {
      infos.push(`${BookFileType.convertToString(book.file.format)}`);
    }

    if (book.file.character_count) {
      infos.push(`약 ${numberWithUnit(book.file.character_count)}자`);
    }

    if (book.file.size) {
      infos.push(`${formatFileSize(book.file.size)}`);
    }

    const delimiter = '|';
    const infosWithDelimiter = infos.join(`\\${delimiter}\\`).split('\\');

    return (
      <div css={styles.fileInfo}>
        {infosWithDelimiter.map(info =>
          info === delimiter ? <div css={styles.fileInfoDelimiter} /> : <div css={styles.fileInfoText}> {info} </div>,
        )}
      </div>
    );
  }

  renderDescription() {
    const { bookDescription } = this.props;
    if (!bookDescription) {
      return null;
    }

    return (
      <div css={styles.bookDescription}>
        <div css={styles.bookDescriptionTitle}>책 소개</div>
        <TextTruncate
          lines={9}
          text={bookDescription.intro}
          lineHeight={25}
          renderExpander={({ expand, isExpanded, isTruncated }) =>
            !isTruncated || isExpanded ? null : (
              <div className="BookDetail_ContentTruncWrapper">
                <Expander onClick={expand} text="계속 읽기" isExpanded={false} />
              </div>
            )
          }
        />
      </div>
    );
  }

  renderDownloadBottuon() {
    const { downloadable } = this.props;

    if (!downloadable) {
      return null;
    }

    return <button css={styles.downloadButton}>다운로드</button>;
  }

  renderDrmFreeDownloadButton() {
    const { book } = this.props;
    if (!book.file.is_drm_free) {
      return null;
    }

    return <button css={styles.drmFreeDownloadButton}>EPUB 파일 다운로드</button>;
  }

  render() {
    // 필요 데이터
    // Unit 데이터 (타이틀)
    // Unit의 대표 bookId
    // 대표 북의 데이터 (썸네일, 작가 등)
    const { unit, book } = this.props;

    return (
      <>
        <section css={styles.detailView}>
          <div css={[styles.wrapper, styles.thumbnailWrapper]}>
            <img css={styles.thumbnail} src={book.thumbnail.large} alt={`${unit.title} 커버이미지`} />
            <div css={styles.ridibooksLink}>리디북스에서 보기 ></div>
          </div>
          <div css={[styles.wrapper, styles.infoWrapper]}>
            <div css={styles.unitTitle}>{unit.title}</div>
            <div css={styles.authorList}>{this.compileAuthors()}</div>
            {this.renderFileInfo()}
            {UnitType.isBook(unit.type) ? this.renderDownloadBottuon() : null}
            {UnitType.isBook(unit.type) ? this.renderDrmFreeDownloadButton() : null}
          </div>
        </section>

        {UnitType.isBook(unit.type) ? this.renderDescription() : null}
      </>
    );
  }
}

export default UnitDetailView;
