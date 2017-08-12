/**
 * Created by Wayuki on 11-Aug-17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux';

import Search from './search/index.jsx';
import SearchResults from './search-results/index.jsx';

@connect(
  ({ app }) => ({
    ...app,
  }),
)
class App extends Component {
  static propTypes = {
    searchResults: PropTypes.arrayOf(PropTypes.number).isRequired,
  };

  render() {
    const {
      searchResults,
    } = this.props;
    return (
      <MuiThemeProvider>
        <div className="app-container container">
          <div className="search-container">
            <Search />
          </div>
          <div className="search-results-container">
            {
              searchResults.length ? (
                <SearchResults />
              ) : null
            }
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
