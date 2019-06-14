export const toDict = (arr, key, extracter = item => item) =>
  arr.reduce((previous, current) => {
    previous[current[key]] = extracter(current);
    return previous;
  }, {});

export const toFlatten = (arr, key, skipNull = false) => {
  const splited = key.split('.');
  const _key = splited.shift();

  let data;
  if (skipNull) {
    data = arr.filter(value => !!value).map(value => value[_key]);
  } else {
    data = arr.map(value => value[_key]);
  }

  if (splited.length === 0) {
    return data;
  }

  return toFlatten(data, splited.join('.'), skipNull);
};

export const makeRange = (start, end) => Array.from({ length: end - start }, (_, k) => k + start);

export const concat = (arr, glue = '_') => arr.join(glue);

export const splitArrayByChunk = (array, chunkSize) =>
  Array.from({ length: Math.ceil(array.length / chunkSize) }, (_, index) => {
    const begin = index * chunkSize;
    return array.slice(begin, begin + chunkSize);
  });

export const makeUnique = array => [...new Set(array)];
