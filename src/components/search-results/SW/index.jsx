/**
 * Created by Wayuki on 13-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import SearchResult from '../SearchResult.jsx';

const SWSearchResults = ({ result, handleResultClick }) => (
  <div className="search-results">
    <SearchResult result={result} onResultClick={handleResultClick} />
  </div>
);

SWSearchResults.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
  handleResultClick: PropTypes.func.isRequired,
};

export default SWSearchResults;
