/**
 * Created by Wayuki on 13-Aug-17.
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import SearchResult from './SearchResult.jsx';

const NSWSearchResults = ({ results, handleResultClick }) => (
  <div className="search-results">
    {
      results.map(result => (
        <SearchResult key={result._id} result={result} onResultClick={handleResultClick} />
      ))
    }
  </div>
);

NSWSearchResults.propTypes = {
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
  handleResultClick: PropTypes.func.isRequired,
};

export default NSWSearchResults;
