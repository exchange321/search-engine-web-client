/**
 * Created by Wayuki on 13-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import SearchResult from './SearchResult.jsx';

const SingleSearchResults = ({ result, handleResultClick }) => (
  <div className="search-results">
    <div className="results-container">
      <SearchResult result={result} id={0} onResultClick={handleResultClick} />
    </div>
  </div>
);

SingleSearchResults.propTypes = {
  result: PropTypes.shape({
    _score: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
    _source: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleResultClick: PropTypes.func.isRequired,
};

export default SingleSearchResults;
