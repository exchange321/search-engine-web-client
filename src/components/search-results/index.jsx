/* eslint-disable no-underscore-dangle */
/**
 * Created by Wayuki on 12-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

import SWSearchResults from './SW/index.jsx';
import NSWSearchResults from './NSW/index.jsx';

const SearchResults = ({ sw, results, handleResultClick }) => (
  sw ? (
    <SWSearchResults result={results[0]._source} handleResultClick={handleResultClick} />
  ) : (
    <NSWSearchResults results={results} />
  )
);

SearchResults.propTypes = {
  sw: PropTypes.bool.isRequired,
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

export default SearchResults;
