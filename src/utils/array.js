export const toDict = (arr, key, extracter = item => item) =>
  arr.reduce((previous, current) => {
    previous[current[key]] = extracter(current);
    return previous;
  }, {});

export const toFlatten = (array, key, skipNull = false) => {
  const _array = skipNull ? array.filter(value => !!value) : array;
  const keys = key.split('.');
  return keys.reduce((data, key) => data.map(value => value[key]), _array);
};

export const makeRange = (start, end) => Array.from({ length: end - start }, (_, k) => k + start);

export const concat = (arr, glue = '_') => arr.join(glue);

export const splitArrayByChunk = (array, chunkSize) =>
  Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, index) => {
    const begin = index * chunkSize;
    return array.slice(begin, begin + chunkSize);
  });

export const makeUnique = array => [...new Set(array)];
