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
    currentPage: PropTypes.number.isRequired,
    pages: PropTypes.number.isRequired,
    results: PropTypes.arrayOf(PropTypes.shape({
      _score: PropTypes.number.isRequired,
      _id: PropTypes.string.isRequired,
      _source: PropTypes.shape({
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }).isRequired,
    })).isRequired,
    actions: PropTypes.shape({
      updateCurrentPage: PropTypes.func.isRequired,
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
    page: undefined,
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
    const { q, p } = QueryString.parse(search);
    if (!q) {
      this.props.routerActions.replace('/');
    } else if (q !== this.state.query || p !== this.state.page) {
      const page = p !== undefined ? parseInt(p, 10) : undefined;
      if (page <= 0) {
        this.props.routerActions.replace(`/search?${QueryString.stringify({ ...QueryString.parse(search), p: 1 })}`);
      } else {
        const state = {
          query: q,
          page,
        };
        this.setState(state);
        this.props.actions.updateCurrentPage(page);
        this.props.actions.triggerSearchState();
        document.title = `${q} - AcceSE Search`;
        this.handleSearch(q, page);
      }
    }
  };
  handleSearch = (query, page) => {
    this.setState({
      isLoading: true,
    });
    this.props.actions.handleQueryChange(query);
    this.props.actions.handleSearch(query, page).then(
      () => {
        if (!this.props.resDisMode) {
          if (this.props.currentPage > 1) {
            if (this.props.pages <= 0) {
              this.props.routerActions.replace(`/search?${QueryString.stringify({ q: query, p: 1 })}`);
            } else if (this.props.pages < this.props.currentPage) {
              this.props.routerActions.replace(`/search?${QueryString.stringify({ q: query, p: this.props.pages })}`);
            }
          }
        }
        this.setState({
          isLoading: false,
        });
      },
    ).catch(
      () => {
        this.setState({
          isLoading: false,
        });
      },
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
  handlePaginationClick = (page) => {
    if (page > 0 && page <= this.props.pages) {
      this.props.routerActions.push(`/search?${QueryString.stringify({ q: this.state.query, p: page })}`);
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
            currentPage={this.props.currentPage}
            pages={this.props.pages}
            results={this.props.results}
            handleResultClick={this.handleResultClick}
            handlePaginationClick={this.handlePaginationClick}
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
