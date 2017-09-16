export default {
  API_URL: (typeof window !== 'undefined' && window.location.hostname !== 'localhost') ? '/api/search' : 'https://accese.wayuki.org/api/search',
};
