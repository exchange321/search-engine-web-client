/* eslint-disable no-underscore-dangle */
import { results } from './data';
import CONFIG from './config';

const apiUrl = CONFIG.API_URL;

export const getCompletions = query => (
  new Promise((resolve, reject) => {
    if (query.length > 0) {
      fetch(`${apiUrl}/autocompletion?q=${query}`).then(res => res.json()).then((body) => {
        resolve(body.buckets.map(completion => ({
          ...completion,
          label: completion.key,
          key: Math.random().toString(36).substring(7),
        })));
      }).catch((err) => {
        reject(err);
      });
    } else {
      resolve([]);
    }
  })
);

// eslint-disable-next-line no-unused-vars
export const getSearchResults = (query, visited = []) => (
  new Promise((resolve) => {
    resolve(results.sort((a, b) => b._score - a._score));
  })
);

export const getDocument = id => (
  new Promise((resolve, reject) => {
    for (let i = 0; i < results.length; i += 1) {
      if (results[i]._id === id) {
        resolve({ ...results[i] });
      }
    }
    reject(new Error('No document found given the id.'));
  })
);

export const getNextDocument = (id, liked) => (
  new Promise((resolve, reject) => {
    getDocument(id).then((doc) => {
      if (liked) {
        resolve(doc._source.branches[0]);
      } else {
        resolve(doc._source.branches[1]);
      }
    }).catch(reject);
  })
);

export default () => {};
