/**
 * Created by Wayuki on 13-Aug-17.
 */
/* eslint-disable no-underscore-dangle */
import React from 'react';
import PropTypes from 'prop-types';

import SearchResult from './SearchResult.jsx';
import Pagination from './Pagination.jsx';

const NSWSearchResults = ({
  currentPage,
  pages,
  results,
  handleResultClick,
  handlePaginationClick,
}) => (
  <div className="search-results">
    <div className="results-container">
      {
        results.map((result, key) => (
          <SearchResult
            key={result._id}
            id={key}
            result={result}
            onResultClick={handleResultClick}
          />
        ))
      }
    </div>
    {
      pages > 1 ? (
        <nav aria-label="Search results navigation" className="pagination-container">
          <Pagination
            currentPage={currentPage}
            pages={pages}
            size={5}
            handlePaginationClick={handlePaginationClick}
          />
        </nav>
      ) : null
    }
  </div>
);

NSWSearchResults.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  results: PropTypes.arrayOf(PropTypes.shape({
    _score: PropTypes.number.isRequired,
    _id: PropTypes.string.isRequired,
    _source: PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }).isRequired,
  })).isRequired,
  handleResultClick: PropTypes.func.isRequired,
  handlePaginationClick: PropTypes.func.isRequired,
};

export default NSWSearchResults;
