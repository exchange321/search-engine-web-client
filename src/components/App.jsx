/**
 * Created by Wayuki on 11-Aug-17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as appActions from '../actions/appActions';

import Search from './search/index.jsx';
import SearchResults from './search-results/index.jsx';

@connect(
  ({ app }) => ({
    ...app,
  }),
  dispatch => ({
    actions: bindActionCreators(appActions, dispatch),
  }),
)
class App extends Component {
  static propTypes = {
    search: PropTypes.shape({
      query: PropTypes.string.isRequired,
      triggered: PropTypes.bool.isRequired,
      suggestions: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
      })).isRequired,
    }).isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.number).isRequired,
    actions: PropTypes.shape({
      handleQueryChange: PropTypes.func.isRequired,
      triggerSearchState: PropTypes.func.isRequired,
    }).isRequired,
  };
  handleQueryChange = (query) => {
    this.props.actions.handleQueryChange(query);
  };
  handleSearchFormSubmit = (e) => {
    e.preventDefault();
    this.props.actions.triggerSearchState();
  };

  render() {
    const {
      search: {
        query,
        triggered,
        suggestions,
      },
      searchResults,
    } = this.props;
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
          <div className={`search-results-container container ${triggered ? 'full' : ''}`}>
            {
              triggered ? (
                <SearchResults results={searchResults} />
              ) : null
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
