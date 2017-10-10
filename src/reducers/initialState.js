const getResDisModeValue = () => {
  if ('localStorage' in window) {
    return localStorage.getItem('resDisMode') !== 'false';
  }
  return true;
};

const getNavDisMode = () => {
  if ('localStorage' in window) {
    const mode = localStorage.getItem('navDisMode') !== 'false';
    if (!mode) {
      if ('Notification' in window && 'serviceWorker' in navigator && Notification.permission === 'granted') {
        return false;
      }
    }
    return true;
  }
  return true;
};

const initialState = {
  app: {
    // true => Single, false => multiple
    resDisMode: getResDisModeValue(),
    // true => iFrame, false => Web Notification
    navDisMode: getNavDisMode(),
    evaluationMode: false,
    search: {
      query: '',
      triggered: false,
      suggestions: [],
    },
  },
  searchPage: {
    currentPage: 1,
    pages: 0,
    results: [],
  },
  resultPage: {
    fullscreen: false,
    history: [],
    whitelist: [],
    blacklist: [],
  },
};

export default initialState;
