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

// eslint-disable-next-line no-unused-vars
export const getSearchResults = (query, whitelist = [], blacklist = [], visited = []) => (
  new Promise((resolve) => {
    setTimeout(() => {
      const filteredResults = results.filter((result) => {
        if (visited.includes(result._source.url)) {
          return false;
        }
        for (let i = 0; i < result._source.categories.length; i += 1) {
          if (blacklist.includes(result._source.categories[i])) {
            return false;
          }
          if (whitelist.includes(result._source.categories[i])) {
            return true;
          }
        }
        return whitelist.length <= 0;
      });
      if (query.length > 0) {
        resolve(filteredResults.sort((a, b) => b._score - a._score));
      }
      resolve([]);
    }, deepDelay);
  })
);

export default () => {};
