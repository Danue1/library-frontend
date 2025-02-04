import { stringify } from 'qs';
import config from '../config';
import { snakelize } from './snakelize';

export const makeURI = (pathname, query = {}, baseHost = null) => {
  // IE11 버그로 get 요청 캐싱 무마하기위해 t 시간값을 매 요청마다 추가
  const _query = snakelize({ ...query, t: +new Date() });
  const path = `${pathname}?${stringify(_query, { skipNulls: true })}`;

  if (baseHost) {
    return `${baseHost}${path}`;
  }

  return path;
};

export const convertUriToAndroidIntentUri = (uri, packageName) => {
  // 앱 호출 URI를 안드로이드 intent를 이용해 호출할 수 있는 URI로 변환해주는 함수
  const scheme = /(.+):\/\//.exec(uri)[1];

  /* 줄바꿈시 공백이 들어가서 다운로드 URI 오류 발생 */
  return `${uri.replace(
    `${scheme}://`,
    'intent://',
  )}#Intent;scheme=${scheme};action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=${packageName};end`;
};

export const makeLoginURI = (authorizeURI, clientId, redirectURI) =>
  `${authorizeURI}?client_id=${clientId}&response_type=code&redirect_uri=${redirectURI}`;

export const makeLibraryLoginURI = (libraryURI, next) => `${libraryURI}?next=${next}`;

// 개발용 웹뷰어가 없기 때문에 도메인을 고정한다.
export const makeWebViewerURI = (bookId, currentUri) =>
  `https://view.ridibooks.com/books/${bookId}?referrer=${encodeURIComponent(currentUri)}`;

export const makeRidiSelectUri = bookId => `${config.SELECT_BASE_URL}/book/${bookId}`;

export const makeRidiStoreUri = bookId => `${config.STORE_API_BASE_URL}/v2/Detail?id=${bookId}`;

export const makeLinkProps = (href, as, query) => {
  const _query = typeof query === 'object' ? snakelize(query) : null;

  const _href = {
    pathname: href,
    query: _query,
  };
  if (typeof href === 'object') {
    _href.pathname = href.pathname;
    if (typeof href.query === 'object') {
      _href.query = { ...snakelize(href.query), ..._query };
    }
  }

  const _as = {
    pathname: as,
    query: _query,
  };
  if (typeof as === 'object') {
    _as.pathname = as.pathname;
    if (typeof as.query === 'object') {
      _as.query = { ...snakelize(as.query), ..._query };
    }
  }

  return {
    href: _href,
    as: _as,
  };
};
