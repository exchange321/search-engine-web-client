/**
 * Created by Wayuki on 11-Aug-17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents';
import applyUpdate from 'serviceworker-webpack-plugin/lib/browser/applyUpdate';
import QueryString from 'query-string';
import toastr from 'toastr';

import * as appActions from '../actions/appActions';

import Search from './SearchBar.jsx';
import SearchPage from './search-page/index.jsx';
import ResultPage from './result-page/index.jsx';

@connect(
  ({ app, resultPage }) => ({
    ...app,
    fullscreen: resultPage.fullscreen,
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch),
    routerActions: bindActionCreators(routerActions, dispatch),
  }),
)
class App extends Component {
  static propTypes = {
    resDisMode: PropTypes.bool.isRequired,
    navDisMode: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    search: PropTypes.shape({
      query: PropTypes.string.isRequired,
      triggered: PropTypes.bool.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      handleQueryChange: PropTypes.func.isRequired,
      triggerSearchState: PropTypes.func.isRequired,
      toggleResDisMode: PropTypes.func.isRequired,
      toggleNavDisMode: PropTypes.func.isRequired,
    }).isRequired,
    routerActions: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };
  componentWillMount() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      this.registerServiceWorker();
    }
  }
  registerServiceWorker = () => {
    const registration = runtime.register();
    registerEvents(registration, {
      onUpdateReady: () => {
        applyUpdate().then(() => {
          window.location.reload();
        });
      },
    });
  };
  handleQueryChange = (query) => {
    this.props.actions.handleQueryChange(query);
  };
  handleSearchFormSubmit = (e) => {
    e.preventDefault();
    const {
      search: {
        query,
      },
    } = this.props;
    if (query.length > 0) {
      this.handleSearch(query);
      e.target.querySelector('input').blur();
      e.target.blur();
    }
  };
  handleSearch = (query) => {
    this.props.routerActions.push(`/search?${QueryString.stringify({ q: query })}`);
  };
  handleResultModeClick = () => {
    this.props.actions.toggleResDisMode();
  };
  handleNavModeClick = () => {
    if (this.props.navDisMode) {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        if (Notification.permission === 'granted') {
          this.props.actions.toggleNavDisMode();
        } else if (Notification.permission !== 'denied') {
          toastr.info('Please enable Web Notification.');
          Notification.requestPermission(() => {
            this.props.actions.toggleNavDisMode();
            window.location.reload();
          });
        }
      }
    } else {
      this.props.actions.toggleNavDisMode();
    }
  };
  render() {
    const {
      resDisMode,
      navDisMode,
      search: {
        query,
        triggered,
        suggestions,
      },
      fullscreen,
    } = this.props;
    return (
      <div className="app-container">
        <div className={`background ${fullscreen ? 'full-screen' : ''}`}>
          <div className="snow" />
        </div>
        <div className={`search-container container ${!triggered ? 'full' : ''}`}>
          <Search
            resDisMode={resDisMode}
            navDisMode={navDisMode}
            query={query}
            suggestions={suggestions}
            onQueryChange={this.handleQueryChange}
            onFormSubmit={this.handleSearchFormSubmit}
            onResultModeClick={this.handleResultModeClick}
            onNavModeClick={this.handleNavModeClick}
          />
        </div>
        <Switch>
          <Route path="/search" component={SearchPage} />
          <Route path="/result" component={ResultPage} />
        </Switch>
      </div>
    );
  }
}

export default App;
