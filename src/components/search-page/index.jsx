/* eslint-disable no-underscore-dangle */
/**
 * Created by Wayuki on 12-Aug-17.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import { routerActions } from 'react-router-redux';

import * as searchResultsActions from '../../actions/searchPageActions';
import { handleQueryChange, triggerSearchState } from '../../actions/appActions';
import { resetHistory, exitFullScreen } from '../../actions/resultPageActions';

import LoaderScreen from '../common/LoaderScreen.jsx';
import SingleSearchResults from './SingleSearchResults.jsx';
import MultipleSearchResults from './MultipleSearchResults.jsx';

@connect(
  ({ app, searchPage }) => ({
    ...searchPage,
    resDisMode: app.resDisMode,
    navDisMode: app.navDisMode,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(searchResultsActions, dispatch),
      ...bindActionCreators({
        handleQueryChange,
        triggerSearchState,
        exitFullScreen,
        resetHistory,
      }, dispatch),
    },
    routerActions: bindActionCreators(routerActions, dispatch),
  }),
)
class SearchPage extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    resDisMode: PropTypes.bool.isRequired,
    navDisMode: PropTypes.bool.isRequired,
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
    actions: PropTypes.shape({
      handleSearch: PropTypes.func.isRequired,
      handleQueryChange: PropTypes.func.isRequired,
      triggerSearchState: PropTypes.func.isRequired,
      exitFullScreen: PropTypes.func.isRequired,
      resetHistory: PropTypes.func.isRequired,
    }).isRequired,
    routerActions: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
    }).isRequired,
  };
  state = {
    isLoading: true,
    query: '',
  };

  componentWillMount() {
    this.refreshPage(this.props.location.search);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.refreshPage(nextProps.location.search);
    }
  }
  refreshPage = (search) => {
    this.props.actions.resetHistory();
    this.props.actions.exitFullScreen();
    const { q } = QueryString.parse(search);
    if (!q) {
      this.props.routerActions.replace('/');
    } else if (q !== this.state.query) {
      this.setState({
        query: q,
      });
      this.props.actions.triggerSearchState();
      document.title = `${q} - AcceSE Search`;
      this.handleSearch(q);
    }
  };
  handleSearch = (query) => {
    this.setState({
      isLoading: true,
    });
    this.props.actions.handleQueryChange(query);
    this.props.actions.handleSearch(query).then(
      () => this.setState({
        isLoading: false,
      }),
    ).catch(
      () => this.setState({
        isLoading: false,
      }),
    );
  };
  handleResultClick = (e, result) => {
    e.preventDefault();
    if (this.props.navDisMode) {
      this.props.routerActions.push(`/result?${QueryString.stringify({
        q: this.state.query,
        id: result._id,
      })}`);
    } else {
      navigator.serviceWorker.controller.postMessage({
        action: 'root',
        info: {
          query: this.state.query,
          result,
        },
      });
      window.location = result._source.url;
    }
  };

  renderLoader = () => (
    <LoaderScreen message="Loading Results..." />
  );

  renderResults = () => (
    <div className="search-page-container container">
      {
        this.props.resDisMode ? (
          <SingleSearchResults
            result={this.props.results[0]}
            handleResultClick={this.handleResultClick}
          />
        ) : (
          <MultipleSearchResults
            results={this.props.results}
            handleResultClick={this.handleResultClick}
          />
        )
      }
    </div>
  );

  render() {
    return (
      this.state.isLoading ? (
        this.renderLoader()
      ) : (
        this.renderResults()
      )
    );
  }
}

export default SearchPage;
