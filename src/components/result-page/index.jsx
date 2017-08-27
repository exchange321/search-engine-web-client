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
  ({ resultPage }) => ({
    ...resultPage,
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
    fullscreen: PropTypes.bool.isRequired,
    history: PropTypes.arrayOf(PropTypes.string).isRequired,
    actions: PropTypes.shape({
      handleQueryChange: PropTypes.func.isRequired,
      triggerSearchState: PropTypes.func.isRequired,
      addVisited: PropTypes.func.isRequired,
      revertHistory: PropTypes.func.isRequired,
      updateHistory: PropTypes.func.isRequired,
      resetHistory: PropTypes.func.isRequired,
      toggleFullScreen: PropTypes.func.isRequired,
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
      SearchAPI.getDocument(id).then((result) => {
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
  handleGetNextDocument = (liked) => {
    this.togglePathDialog();
    SearchAPI.getNextDocument(this.state.result._id, liked).then((id) => {
      this.props.routerActions.push(`/result?${QueryString.stringify({
        q: this.state.query,
        id,
      })}`);
    }).catch((e) => {
      toastr.error(e.message);
    });
  };
  handlePageLoadError = () => {
    toastr.error(`'${this.state.result._source.title}' page has failed to load. Next document has retrieved.`);
    this.props.actions.revertHistory();
    SearchAPI.getNextDocument(this.state.result._id, true).then((id) => {
      this.props.routerActions.replace(`/result?${QueryString.stringify({
        q: this.state.query,
        id,
      })}`);
    }).catch((e) => {
      toastr.error(e.message);
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
        fullscreen={this.props.fullscreen}
        result={this.state.result}
        handleFullScreenClick={this.handleToolsFullScreenClick}
        handlePrevClick={this.handleToolsPrevClick}
        handleNextClick={this.handleToolsNextClick}
        handlePageLoadError={this.handlePageLoadError}
      />
      <Modal isOpen={this.state.dialog} toggle={this.togglePathDialog} className="next-result-modal">
        <ModalHeader toggle={this.togglePathDialog}>Are you lost?</ModalHeader>
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