/**
 * Created by Wayuki on 13-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import SearchResult from '../SearchResult.jsx';

const SWSearchResults = ({ result }) => (
  <div className="search-results">
    <SearchResult result={result} />
  </div>
);

SWSearchResults.propTypes = {
  result: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};

export default SWSearchResults;
