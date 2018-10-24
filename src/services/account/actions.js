export const LOAD_USER_INFO = 'LOAD_USER_INFO';
export const SET_USER_INFO = 'SET_USER_INFO';

export const START_ACCOUNT_TRACKER = 'START_ACCOUNT_TRACKER';

export const loadUserInfo = () => ({
  type: LOAD_USER_INFO,
});

export const setUserInfo = userInfo => ({
  type: SET_USER_INFO,
  payload: {
    userInfo,
  },
});

export const startAccountTracker = () => ({
  type: START_ACCOUNT_TRACKER,
});