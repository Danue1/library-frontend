import { SET_BOOK_DATA, SET_BOOK_DATA_FROM_STORAGE, SET_BOOK_DESCRIPTIONS, SET_UNIT_DATA } from './actions';

const makeEntries = entries => entries.map(entry => ({ key: entry.id, value: entry }));
const compareWithTTL = (oldValue, newValue) => oldValue.ttl < newValue.ttl;

const bookReducer = (state = {}, action) => {
  switch (action.type) {
    case SET_BOOK_DATA:
      state.books.merge(makeEntries(action.payload.books), compareWithTTL);
      return state;
    case SET_BOOK_DESCRIPTIONS:
      state.bookDescriptions.merge(makeEntries(action.payload.bookDescriptions), compareWithTTL);
      return state;
    case SET_UNIT_DATA:
      state.units.merge(makeEntries(action.payload.units), compareWithTTL);
      return state;
    case SET_BOOK_DATA_FROM_STORAGE:
      state.books.assign(action.payload.books, compareWithTTL, true);
      state.units.assign(action.payload.units, compareWithTTL, true);
      return state;
    default:
      return state;
  }
};

export default bookReducer;
