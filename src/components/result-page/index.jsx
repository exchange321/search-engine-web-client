/* eslint-disable no-underscore-dangle,react/jsx-boolean-value */
/**
 * Created by Wayuki on 25-Aug-17.
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { routerActions } from 'react-router-redux';
import PropTypes from 'prop-types';
import QueryString from 'query-string';
import toastr from 'toastr';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import pathsImg from '../../images/paths.jpg';
import moreImg from '../../images/more.png';
import noImg from '../../images/no.png';

import { triggerSearchState, handleQueryChange } from '../../actions/appActions';
import * as resultPageActions from '../../actions/resultPageActions';
import * as SearchAPI from '../../api/search';

import LoaderScreen from '../common/LoaderScreen.jsx';
import PageContainer from './PageContainer.jsx';

@connect(
  ({ app, resultPage }) => ({
    ...resultPage,
    evaluationMode: app.evaluationMode,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators(resultPageActions, dispatch),
      ...bindActionCreators({ triggerSearchState, handleQueryChange }, dispatch),
    },
    routerActions: bindActionCreators(routerActions, dispatch),
  }),
)
class ResultPage extends Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
    evaluationMode: PropTypes.bool.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    history: PropTypes.arrayOf(PropTypes.string).isRequired,
    whitelist: PropTypes.arrayOf(PropTypes.string).isRequired,
    blacklist: PropTypes.arrayOf(PropTypes.string).isRequired,
    onImprovedResultClick: PropTypes.func.isRequired,
    actions: PropTypes.shape({
      handleQueryChange: PropTypes.func.isRequired,
      triggerSearchState: PropTypes.func.isRequired,
      addVisited: PropTypes.func.isRequired,
      revertHistory: PropTypes.func.isRequired,
      updateHistory: PropTypes.func.isRequired,
      resetHistory: PropTypes.func.isRequired,
      toggleFullScreen: PropTypes.func.isRequired,
      registerWhitelist: PropTypes.func.isRequired,
      registerBlacklist: PropTypes.func.isRequired,
    }).isRequired,
    routerActions: PropTypes.shape({
      push: PropTypes.func.isRequired,
      replace: PropTypes.func.isRequired,
      goBack: PropTypes.func.isRequired,
    }).isRequired,
  };
  state = {
    query: '',
    result: null,
    loading: true,
    dialog: false,
  };
  componentWillMount() {
    this.refreshPage(this.props.location.search);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search !== this.props.location.search) {
      this.refreshPage(nextProps.location.search);
    }
  }
  handleToolsFullScreenClick = () => {
    this.props.actions.toggleFullScreen();
  };
  handleToolsPrevClick = () => {
    const { history, fullscreen } = this.props;
    if (history.length < 2) {
      if (history.length > 0) {
        this.props.actions.resetHistory();
      }
      if (fullscreen) {
        this.props.actions.toggleFullScreen();
      }
      this.props.routerActions.goBack();
    } else {
      this.props.actions.revertHistory(2);
      this.props.routerActions.goBack();
    }
  };
  handleToolsNextClick = () => {
    this.togglePathDialog();
  };
  handleToolsCompletedClick = () => {
    const docId = this.props.whitelist.length + this.props.blacklist.length + 1;
    this.props.onImprovedResultClick(docId);
    this.props.routerActions.replace(`/search?${QueryString.stringify({
      q: this.state.query,
    })}`);
  };
  refreshPage = (search) => {
    const { q: query, id } = QueryString.parse(search);
    if (!(query && id)) {
      if (query) {
        this.props.routerActions.replace(`/search?${QueryString.stringify({
          q: query,
        })}`);
      } else {
        this.props.routerActions.replace('/');
      }
    } else {
      this.setState({
        loading: true,
      });
      this.props.actions.handleQueryChange(query);
      this.props.actions.addVisited(id);
      this.props.actions.triggerSearchState();
      SearchAPI.getDocument(id, true).then((result) => {
        this.setState({
          query,
          result,
          loading: false,
        });
        document.title = `${result._source.title} - AcceSE Result`;
      }).catch((e) => {
        this.setState({
          loading: false,
        });
        toastr.error(e.message);
        this.props.routerActions.replace(`/search?${QueryString.stringify({
          q: query,
        })}`);
      });
    }
  };
  // eslint-disable-next-line no-unused-vars
  handleGetNextDocument = (liked) => {
    let whitelist = [...this.props.whitelist];
    let blacklist = [...this.props.blacklist];
    if (liked) {
      whitelist = [...whitelist, this.state.result._id];
      this.props.actions.registerWhitelist(this.state.result._id);
    } else {
      blacklist = [...blacklist, this.state.result._id];
      this.props.actions.registerBlacklist(this.state.result._id);
    }
    this.togglePathDialog();
    SearchAPI.getNextDocument(
      this.state.query,
      true,
      whitelist,
      blacklist,
    ).then((doc) => {
      this.props.routerActions.push(`/result?${QueryString.stringify({
        q: this.state.query,
        id: doc._id,
      })}`);
    }).catch((e) => {
      toastr.error(e.message);
      this.props.routerActions.push(`/search?${QueryString.stringify({
        q: this.state.query,
      })}`);
    });
  };
  handlePageLoadError = () => {
    toastr.error(`'${this.state.result._source.title}' page has failed to load. Next document has retrieved.`);
    this.props.actions.revertHistory();
    this.props.actions.registerBlacklist(this.state.result._id);
    SearchAPI.getNextDocument(
      this.state.query,
      true,
      this.props.whitelist,
      [...this.props.blacklist, this.state.result._id],
    ).then((doc) => {
      this.props.routerActions.replace(`/result?${QueryString.stringify({
        q: this.state.query,
        id: doc._id,
      })}`);
    }).catch((e) => {
      toastr.error(e.message);
      this.props.routerActions.push(`/search?${QueryString.stringify({
        q: this.state.query,
      })}`);
    });
  };
  togglePathDialog = () => {
    this.setState({
      dialog: !this.state.dialog,
    });
  };
  renderLoader = () => (
    <LoaderScreen message="Loading Page..." />
  );
  renderPage = () => (
    <div className="result-page-container container">
      <PageContainer
        evaluationMode={this.props.evaluationMode}
        fullscreen={this.props.fullscreen}
        result={this.state.result}
        handleFullScreenClick={this.handleToolsFullScreenClick}
        handlePrevClick={this.handleToolsPrevClick}
        handleNextClick={this.handleToolsNextClick}
        handleCompletedClick={this.handleToolsCompletedClick}
        handlePageLoadError={this.handlePageLoadError}
      />
      <Modal isOpen={this.state.dialog} toggle={this.togglePathDialog} className="next-result-modal">
        <ModalHeader toggle={this.togglePathDialog}>What&apos;s Next?</ModalHeader>
        <ModalBody>
          <div className="img-container">
            <img src={pathsImg} className="body-path-img" alt="choices" />
          </div>
          <div className="buttons-container row">
            <div className="button-container col row">
              <button className="btn-more btn-like col" onClick={() => this.handleGetNextDocument(true)}>
                <img src={moreImg} className="btn-img" alt="Like" /><br />
                <span className="btn-text">I liked it, show me another one</span>
              </button>
            </div>
            <div className="button-container col row">
              <button className="btn-more btn-unlike col" onClick={() => this.handleGetNextDocument(false)}>
                <img src={noImg} className="btn-img" alt="Unlike" /><br />
                <span className="btn-text">I want a better one</span>
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
  render() {
    return (
      this.state.loading ? (
        this.renderLoader()
      ) : (
        this.renderPage()
      )
    );
  }
}

export default ResultPage;
