/** @jsx jsx */
import { jsx } from '@emotion/core';
import config from '../../../config';

const ENV = {
  LOCAL: 'local',
  DEV: 'development',
  STAGING: 'staging',
};

const environmentBandStyle = environment => {
  let background = '';
  if (environment === ENV.LOCAL) {
    background = 'darkgray';
  } else if (environment === ENV.DEV) {
    background = 'green';
  } else if (environment === ENV.STAGING) {
    background = 'red';
  }

  return {
    display: 'block',
    textAlign: 'center',
    padding: '4px',
    fontSize: '12px',
    fontWeight: 900,
    color: 'white',
    background,
  };
};

export const Environment = () => {
  const { ENVIRONMENT: environmentTitle } = config;
  switch (environmentTitle) {
    case ENV.LOCAL:
    case ENV.DEV:
      return <p css={environmentBandStyle(environmentTitle)}>{environmentTitle}</p>;
    case ENV.STAGING:
      return (
        <a css={environmentBandStyle(environmentTitle)} href={`${config.BASE_URL}/production`}>
          {environmentTitle}
        </a>
      );
    default:
      return null;
  }
};
