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
export const getSearchResults = (query, whitelist = {}, blacklist = {}, visited = []) => (
  new Promise((resolve) => {
    setTimeout(() => {
      const filteredResults = [];
      results.forEach((result) => {
        if (!visited.includes(result._source.url)) {
          const temp = { ...result };
          for (let i = 0; i < temp._source.categories.length; i += 1) {
            if (whitelist[temp._source.categories[i]]) {
              temp._score *= 1.10 ** Math.sqrt(whitelist[temp._source.categories[i]]);
            }
            if (blacklist[temp._source.categories[i]]) {
              temp._score *= 0.90 ** Math.sqrt(blacklist[temp._source.categories[i]]);
            }
          }
          filteredResults.push(temp);
        }
      });
      if (query.length > 0) {
        resolve(filteredResults.sort((a, b) => b._score - a._score));
      }
      resolve([]);
    }, deepDelay);
  })
);

export default () => {};
