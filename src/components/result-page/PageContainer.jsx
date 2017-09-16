/* eslint-disable no-underscore-dangle */
/**
 * Created by Wayuki on 26-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import Tools from './Tools.jsx';
import Page from './Page.jsx';

const PageContainer = ({
  fullscreen,
  result,
  handleFullScreenClick,
  handlePrevClick,
  handleNextClick,
  handlePageLoadError,
}) => (
  <div className="page-container">
    <Tools
      result={result}
      fullscreen={fullscreen}
      handleFullScreenClick={handleFullScreenClick}
      handlePrevClick={handlePrevClick}
      handleNextClick={handleNextClick}
    />
    <Page
      title={result._source.title}
      url={result._source.url}
      fullscreen={fullscreen}
      handlePageLoadError={handlePageLoadError}
    />
  </div>
);

PageContainer.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  result: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    _score: PropTypes.number.isRequired,
    _source: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleFullScreenClick: PropTypes.func.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  handlePageLoadError: PropTypes.func.isRequired,
};

export default PageContainer;
