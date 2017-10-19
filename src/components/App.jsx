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
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

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
    modalMessage: '',
    modalFooter: '',
    baselineRank: 0,
    improvedRank: 0,
  };
  componentWillMount() {
    if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost')) {
      this.registerServiceWorker();
    }
    window.localStorage.removeItem('storedRanks');
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
    this.setState({
      modalTitle: (
        <h4 className="modal-title text-danger">Enabling Evaluation Mode</h4>
      ),
      modalMessage: (
        <div>
          <div className="alert alert-danger" role="alert">
            <strong>
              This mode is for testing purpose only.
              Please leave if entered unintentionally.
            </strong>
          </div>
          <p className="h5">
            <strong className="text-danger">Query cannot be changed during evaluation.</strong>
          </p>
          <p className="lead">
            Please make sure the query is properly submitted before proceeding.
          </p>
          <p className="lead">
            The evaluation consists of three steps:
            <ul>
              <li>Step 1 - Baseline Model</li>
              <li>Step 2 - Improved Model</li>
              <li>Step 3 - Evaluation Result</li>
            </ul>
            Please follow the on-screen instructions to conduct a meaningful evaluation.
          </p>
        </div>
      ),
      modalFooter: (
        <div className="btn-group">
          <button className="btn btn-outline-danger" onClick={this.handleEvaluationProceedClick}>Proceed</button>
          <button className="btn btn-primary" onClick={this.toggleModal}>Cancel</button>
        </div>
      ),
    }, this.toggleModal);
  };
  handleEvaluationProceedClick = () => {
    toastr.success('Start Evaluation.');
    this.props.actions.enableEvaluationMode();
    this.setState({
      resDisMode: this.props.resDisMode,
      navDisMode: this.props.navDisMode,
      modalTitle: '',
      modalMessage: '',
      modalFooter: '',
      baselineRank: 0,
      improvedRank: 0,
    }, () => {
      if (!this.props.navDisMode) {
        this.props.actions.toggleNavDisMode();
      }
      if (this.props.resDisMode) {
        this.props.actions.toggleResDisMode();
      }
      this.setState({
        modalTitle: (
          <h4 className="modal-title">Evaluation - Step 1 - Baseline Model</h4>
        ),
        modalMessage: (
          <p className="lead">Please select the <strong>FIRST</strong> relevant document from the results.</p>
        ),
        modalFooter: (
          <div>
            <button className="btn btn-primary" onClick={this.toggleModal}>Close</button>
          </div>
        ),
      });
    });
  };
  handleBaselineResultClick = (docId) => {
    const baselineRank = 1 / docId;
    this.setState({
      baselineRank,
      modalTitle: (
        <h4 className="modal-title">Evaluation - Step 2 - Improved Model</h4>
      ),
      modalMessage: (
        <p className="lead">Please navigate the results and press <em>Completed</em> once a relevant document is shown.</p>
      ),
      modalFooter: (
        <div>
          <button className="btn btn-primary" onClick={this.toggleModal}>Close</button>
        </div>
      ),
    }, () => {
      this.toggleModal();
    });
  };
  handleImprovedResultClick = (docId) => {
    const improvedRank = 1 / docId;
    this.setState({
      improvedRank,
    }, () => {
      let storedRanks = JSON.parse(window.localStorage.getItem('storedRanks') || '[]');
      storedRanks = JSON.stringify([...storedRanks, {
        query: this.props.search.query,
        reciprocal_rank: {
          baseline_model: this.state.baselineRank,
          improved_model: this.state.improvedRank,
        },
      }], null, 4);
      window.localStorage.setItem('storedRanks', storedRanks);
      const rankingString = `data:text/json;charset=utf-8,${encodeURIComponent(storedRanks)}`;
      this.setState({
        modalTitle: (
          <h4 className="modal-title">Evaluation - Step 3 - Result</h4>
        ),
        modalMessage: (
          <div>
            <p className="lead">Query: {this.props.search.query}</p>
            <p>Reciprocal Rank (Higher is Better)
              <ul>
                <li className={`${this.state.baselineRank >= this.state.improvedRank ? 'font-weight-bold' : ''}`}>
                  Baseline Model: {this.state.baselineRank.toFixed(2)}
                </li>
                <li className={`${this.state.improvedRank >= this.state.baselineRank ? 'font-weight-bold' : ''}`}>
                  Improved Model: {this.state.improvedRank.toFixed(2)}
                </li>
              </ul>
            </p>
          </div>
        ),
        modalFooter: (
          <div className="btn-group">
            <a target="_blank" href={rankingString} download="results.json" className="btn btn-outline-success">Download Results</a>
            <button className="btn btn-primary" onClick={this.toggleModal}>Close</button>
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
        <Modal isOpen={this.state.showModal} backdrop="static">
          <ModalHeader>{this.state.modalTitle}</ModalHeader>
          <ModalBody>
            {this.state.modalMessage}
          </ModalBody>
          <ModalFooter>
            {this.state.modalFooter}
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default App;
