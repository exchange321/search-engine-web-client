/**
 * Created by Wayuki on 11-Aug-17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents';
import applyUpdate from 'serviceworker-webpack-plugin/lib/browser/applyUpdate';
import QueryString from 'query-string';

import loader from '../images/gif-loader.gif';

import * as appActions from '../actions/appActions';

import Search from './search/index.jsx';
import SearchResults from './search-results/index.jsx';

@connect(
  ({ app }) => ({
    ...app,
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch),
    routerActions: bindActionCreators(routerActions, dispatch),
  }),
)
class App extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string,
    }).isRequired,
    search: PropTypes.shape({
      query: PropTypes.string.isRequired,
      triggered: PropTypes.bool.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    searchResults: PropTypes.shape({
      sw: PropTypes.bool.isRequired,
      results: PropTypes.arrayOf(PropTypes.shape({
        _score: PropTypes.number.isRequired,
        _id: PropTypes.string.isRequired,
        _source: PropTypes.shape({
          title: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          image: PropTypes.string.isRequired,
          url: PropTypes.string.isRequired,
          categories: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        }).isRequired,
      })).isRequired,
    }).isRequired,
    actions: PropTypes.shape({
      handleQueryChange: PropTypes.func.isRequired,
      handleQuerySubmit: PropTypes.func.isRequired,
      triggerSearchState: PropTypes.func.isRequired,
      enableServiceWorker: PropTypes.func.isRequired,
      disableServiceWorker: PropTypes.func.isRequired,
    }).isRequired,
    routerActions: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };
  state = {
    loadingResults: false,
  };
  componentWillMount() {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        this.registerServiceWorker();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission((permission) => {
          if (permission === 'granted') {
            this.registerServiceWorker();
          }
        });
      }
    }
    if (this.props.location && this.props.location.search) {
      const { query } = QueryString.parse(this.props.location.search);
      if (query) {
        this.props.actions.handleQueryChange(query);
        this.handleSearching(query, false);
      }
    }
  }
  registerServiceWorker = () => {
    const registration = runtime.register();
    this.props.actions.enableServiceWorker();
    registerEvents(registration, {
      onInstalled: () => {
        this.props.actions.enableServiceWorker();
      },
      onUpdateReady: () => {
        this.props.actions.disableServiceWorker();
        applyUpdate().then(() => {
          window.location.reload();
        });
      },
      onUpdating: () => {
        this.props.actions.disableServiceWorker();
      },
      onUpdateFailed: () => {
        this.props.actions.disableServiceWorker();
      },
      onUpdated: () => {
        this.props.actions.enableServiceWorker();
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
      this.handleSearching(query);
    }
  };
  handleSearching = (query, redirect = true) => {
    this.props.actions.triggerSearchState();
    this.setState({
      loadingResults: true,
    });
    document.title = `${query} - AcceSE Search`;
    if (redirect) {
      this.props.routerActions.push(`/?${QueryString.stringify({ query })}`);
    }
    this.props.actions.handleQuerySubmit(query).then(() => (
      this.setState({ loadingResults: false })
    ));
  };
  handleResultClick = (e, query, result) => {
    if (this.props.searchResults.sw) {
      e.preventDefault();
      navigator.serviceWorker.controller.postMessage({
        action: 'root',
        info: {
          query,
          result,
        },
      });
    }
  };

  render() {
    const {
      search: {
        query,
        triggered,
        suggestions,
      },
      searchResults: {
        sw,
        results,
      },
    } = this.props;
    const { loadingResults } = this.state;
    return (
      <MuiThemeProvider>
        <div className="app-container">
          <div className={`search-container container ${!triggered ? 'full' : ''}`}>
            <Search
              query={query}
              suggestions={suggestions}
              onQueryChange={this.handleQueryChange}
              onFormSubmit={this.handleSearchFormSubmit}
            />
          </div>
          {
            loadingResults ? (
              <div className="loading-results-container container">
                <div className="img-container">
                  <img src={loader} alt="Loading..." />
                </div>
                <div className="text-container">
                  <p className="lead">Loading Results...</p>
                </div>
              </div>
            ) : (
              <div className={`search-results-container container ${triggered ? 'full' : ''}`}>
                {
                  triggered ? (
                    <SearchResults
                      sw={sw}
                      results={results}
                      handleResultClick={(e, result) => this.handleResultClick(e, query, result)}
                    />
                  ) : null
                }
              </div>
            )
          }
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
