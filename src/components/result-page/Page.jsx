/**
 * Created by Wayuki on 26-Aug-17.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoaderBlock from '../common/LoaderBlock.jsx';

class Page extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    handlePageLoadError: PropTypes.func.isRequired,
  };
  constructor(props) {
    super(props);
    this.isError = true;
  }
  state = {
    isLoading: true,
  };
  handlePageLoaded = () => {
    clearTimeout(this.timer);
    if (this.isError) {
      this.props.handlePageLoadError();
    } else {
      this.setState({
        isLoading: false,
      });
    }
  };
  render() {
    this.timer = setTimeout(() => {
      this.isError = false;
    }, 500);
    const {
      title,
      url,
      fullscreen,
    } = this.props;
    return (
      <div className="page-iframe-container">
        <div className="page-info">
          <p className="page-title" title={title}>{ title }</p>
          <p className="page-url" title={url}>{ url }</p>
        </div>
        <div className={`iframe-container ${fullscreen ? 'full-screen' : ''}`}>
          <iframe src={url} title={title} className={`${this.state.isLoading ? '' : 'iframe-show'}`} onLoad={this.handlePageLoaded} />
          {
            this.state.isLoading ? (
              <LoaderBlock message="Loading Page..." />
            ) : null
          }
        </div>
      </div>
    );
  }
}

export default Page;
