/* eslint-disable no-underscore-dangle */
import CONFIG from './config';

const apiUrl = CONFIG.API_URL;

export const getCompletions = (query, navDisMode) => (
  new Promise((resolve, reject) => {
    if (query.length > 0) {
      fetch(`${apiUrl}/autocompletion?q=${query}&i=${navDisMode.toString()}`).then(res => res.json()).then((body) => {
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
export const getSearchResults = (query, navDisMode, resDisMode, page = 1) => (
  new Promise((resolve, reject) => {
    let uri = `${apiUrl}/document?q=${query}&i=${navDisMode.toString()}`;
    if (!resDisMode) {
      uri += `&p=${page}`;
    }
    fetch(uri).then(res => res.json()).then((body) => {
      resolve({
        pages: Math.ceil(body.hits.total / 10),
        results: body.hits.hits,
      });
    }).catch(reject);
  })
);

export const getDocument = (id, navDisMode) => (
  new Promise((resolve, reject) => {
    fetch(`${apiUrl}/document?id=${id}&i=${navDisMode.toString()}`).then(res => res.json()).then((body) => {
      if (body.hits.hits.length <= 0) {
        throw new Error('No such document.');
      } else {
        resolve(body.hits.hits[0]);
      }
    }).catch(reject);
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
