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
export const getSearchResults = (query, visited = []) => (
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(results.sort((a, b) => b._score - a._score));
    }, deepDelay);
  })
);

export const getDocument = id => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      for (let i = 0; i < results.length; i += 1) {
        if (results[i]._id === id) {
          resolve({ ...results[i] });
        }
      }
      reject(new Error('No document found given the id.'));
    }, deepDelay);
  })
);

export const getNextDocument = (id, liked) => (
  new Promise((resolve, reject) => {
    setTimeout(() => {
      getDocument(id).then((doc) => {
        if (liked) {
          resolve(doc._source.branches[0]);
        } else {
          resolve(doc._source.branches[1]);
        }
      }).catch(reject);
    }, deepDelay);
  })
);

export default () => {};
