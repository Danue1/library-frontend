import { SET_VIEW_TYPE, SET_FULL_SCREEN_LOADING, SET_IS_ERROR } from './actions';
import { initialState } from './state';
import settings from '../../utils/settings';

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FULL_SCREEN_LOADING:
      return {
        ...state,
        fullScreenLoading: action.payload.isLoading,
      };
    case SET_VIEW_TYPE:
      settings.viewType = action.payload.viewType;
      return {
        ...state,
        viewType: action.payload.viewType,
      };
    case SET_IS_ERROR:
      return {
        ...state,
        isError: action.payload.isError,
      };
    default:
      return state;
  }
};

export default uiReducer;
