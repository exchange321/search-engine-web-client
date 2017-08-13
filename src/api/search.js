/* eslint-disable no-underscore-dangle */
import { delay, deepDelay } from './delay';
import { results } from './data';

export const getCompletions = query => (
  new Promise((resolve) => {
    setTimeout(() => {
      if (query.length > 0) {
        resolve([
          {
            key: '1',
            label: 'apple',
          },
        ]);
      }
      resolve([]);
    }, delay);
  })
);

export const getSearchResults = query => (
  new Promise((resolve) => {
    setTimeout(() => {
      if (query.length > 0) {
        resolve(results.sort((a, b) => b._score - a._score));
      }
      resolve([]);
    }, deepDelay);
  })
);

export default () => {};
