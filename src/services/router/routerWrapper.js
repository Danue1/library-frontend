import * as Sentry from '@sentry/browser';
import React from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';

import { setLocation, commitLocation, rollbackLocation } from './actions';
import { locationFromUrl } from './utils';

const createConnectedRouterWrapper = () => {
  const toRoute = path => path.replace(/\/$/, '') || '/';
  class RouterWrapper extends React.Component {
    componentDidMount() {
      Router.events.on('routeChangeStart', this.listenRouteChange);
      Router.events.on('routeChangeError', this.finishRouteChangeWithError);
      Router.events.on('routeChangeComplete', this.finishRouteChange);
    }

    componentWillUnmount() {
      Router.events.off('routeChangeStart', this.listenRouteChange);
      Router.events.off('routeChangeError', this.finishRouteChangeWithError);
      Router.events.off('routeChangeComplete', this.finishRouteChange);
    }

    listenRouteChange = as => {
      const location = locationFromUrl(as);
      Sentry.addBreadcrumb({
        category: 'router',
        message: 'Route change initiated',
        level: Sentry.Severity.Info,
        data: { as, location: JSON.stringify(location) },
      });
      const { setLocation: dispatchSetLocation } = this.props;
      dispatchSetLocation(location);
    };

    finishRouteChange = () => {
      const [isMismatch, url] = this.checkMismatch();
      if (isMismatch) {
        this.rollback(url);
      } else {
        this.commit();
      }
    };

    finishRouteChangeWithError = (err, url) => {
      console.error(err);
      Sentry.addBreadcrumb({
        category: 'router',
        message: 'Route change failed',
        level: Sentry.Severity.Warning,
        data: { url },
      });
      this.finishRouteChange();
    };

    checkMismatch() {
      const {
        location: { pathname: pathnameInStore, search: searchInStore, hash: hashInStore },
      } = this.props;
      const { pathname: pathnameInHistory, search: searchInHistory, hash: hashInHistory } = locationFromUrl(Router.asPath);
      return [
        pathnameInStore !== pathnameInHistory || searchInStore !== searchInHistory || hashInStore !== hashInHistory,
        `${pathnameInStore}${searchInStore}${hashInStore}`,
      ];
    }

    commit() {
      Sentry.addBreadcrumb({
        category: 'router',
        message: 'Committing route',
        level: Sentry.Severity.Info,
      });
      const { commitLocation: dispatchCommitLocation } = this.props;
      dispatchCommitLocation();
    }

    rollback(url, as = url) {
      Sentry.addBreadcrumb({
        category: 'router',
        message: 'Rolling back',
        level: Sentry.Severity.Info,
        data: { url },
      });
      // Router의 Events를 보내지 않고 페이지 복구를 위해 Router코드를 직접 호출함
      // `change` 메소드의 간소화 버전, https://github.com/zeit/next.js/blob/canary/packages/next-server/lib/router/router.js
      const { rollbackLocation: dispatchRollbackLocation } = this.props;
      dispatchRollbackLocation();

      if (Router.router.onlyAHashChange(url)) {
        Router.router.changeState('replaceState', url, as);
        Router.router.scrollToHash(url);
        return true;
      }

      const { pathname, query, hash } = locationFromUrl(url, true);
      const route = toRoute(pathname);
      const routeInfo = Router.router.components[route];
      Router.router.changeState('replaceState', url, as);
      Router.router.set(route, pathname, query, url, {
        ...routeInfo,
        hash,
      });
      return true;
    }

    render() {
      const { children } = this.props;
      return children || <></>;
    }
  }

  return connect(
    state => ({ location: state.router.location }),
    {
      setLocation,
      commitLocation,
      rollbackLocation,
    },
  )(RouterWrapper);
};

export default createConnectedRouterWrapper;
