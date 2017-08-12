import { delay } from './delay';

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

export default () => {};
