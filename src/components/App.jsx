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
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

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
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
    resDisMode: PropTypes.bool.isRequired,
    navDisMode: PropTypes.bool.isRequired,
    evaluationMode: PropTypes.bool.isRequired,
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
      enableEvaluationMode: PropTypes.func.isRequired,
      disableEvaluationMode: PropTypes.func.isRequired,
    }).isRequired,
    routerActions: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };
  state = {
    resDisMode: undefined,
    navDisMode: undefined,
    showModal: false,
    modalTitle: '',
    modalMessage: <p />,
    baselineRank: 0,
    improvedRank: 0,
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
    let uri = `/search?${QueryString.stringify({ q: query })}`;
    if (!this.props.resDisMode) {
      uri += '&p=1';
    }
    this.props.routerActions.push(uri);
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
  handleEvaluationClick = () => {
    toastr.success('Start Evaluation.');
    this.props.actions.enableEvaluationMode();
    this.setState({
      resDisMode: this.props.resDisMode,
      navDisMode: this.props.navDisMode,
      modalTitle: '',
      modalMessage: <p />,
      baselineRank: 0,
      improvedRank: 0,
    });
    if (!this.props.navDisMode) {
      this.props.actions.toggleNavDisMode();
    }
    if (this.props.resDisMode) {
      this.props.actions.toggleResDisMode();
    }
    this.setState({
      modalTitle: 'Evaluation - Baseline Model',
      modalMessage: <p className="lead">Please select the <strong>FIRST</strong> relevant document from the results.</p>,
    }, this.toggleModal);
  };
  handleBaselineResultClick = (docId) => {
    const baselineRank = 1 / docId;
    this.setState({
      baselineRank,
      modalTitle: 'Evaluation - Improved Model',
      modalMessage: <p className="lead">Please navigate the results and press <em>Completed</em> once a relevant document is shown.</p>,
    }, () => {
      this.toggleModal();
    });
  };
  handleImprovedResultClick = (docId) => {
    const improvedRank = 1 / docId;
    this.setState({
      improvedRank,
    }, () => {
      this.setState({
        modalTitle: 'Evaluation - Result',
        modalMessage: (
          <div>
            <p className="h4">Reciprocal Rank (Higher is Better)</p>
            <ul>
              <li className={`lead ${this.state.baselineRank >= this.state.improvedRank ? 'font-weight-bold' : ''}`}>
                Baseline Model: {this.state.baselineRank.toFixed(2)}
              </li>
              <li className={`lead ${this.state.improvedRank >= this.state.baselineRank ? 'font-weight-bold' : ''}`}>
                Improved Model: {this.state.improvedRank.toFixed(2)}
              </li>
            </ul>
          </div>
        ),
      }, () => {
        this.toggleModal();
        if (this.props.resDisMode !== this.state.resDisMode) {
          this.handleResultModeClick();
        }
        if (this.props.navDisMode !== this.state.navDisMode) {
          this.handleNavModeClick();
        }
        this.props.actions.disableEvaluationMode();
        toastr.success('Evaluation Completed.');
      });
    });
  };
  toggleModal = () => this.setState({
    showModal: !this.state.showModal,
  });
  render() {
    const {
      resDisMode,
      navDisMode,
      evaluationMode,
      location: {
        pathname,
      },
      search: {
        query,
        triggered,
        suggestions,
      },
      fullscreen,
    } = this.props;
    return (
      <div className="app-container">
        <div className={`background ${fullscreen ? 'full-screen' : ''} ${evaluationMode ? 'evaluation' : ''}`}>
          <div className="snow" />
        </div>
        <div className={`search-container container ${!triggered ? 'full' : ''}`}>
          <Search
            resDisMode={resDisMode}
            navDisMode={navDisMode}
            evaluationMode={evaluationMode}
            query={query}
            pathname={pathname}
            suggestions={suggestions}
            onQueryChange={this.handleQueryChange}
            onFormSubmit={this.handleSearchFormSubmit}
            onResultModeClick={this.handleResultModeClick}
            onNavModeClick={this.handleNavModeClick}
            onEvaluationClick={this.handleEvaluationClick}
          />
        </div>
        <Switch>
          <Route path="/search" render={props => <SearchPage {...props} onBaselineResultClick={this.handleBaselineResultClick} />} />
          <Route path="/result" render={props => <ResultPage {...props} onImprovedResultClick={this.handleImprovedResultClick} />} />
        </Switch>
        <Modal isOpen={this.state.showModal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>{this.state.modalTitle}</ModalHeader>
          <ModalBody>
            {this.state.modalMessage}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.toggleModal}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
