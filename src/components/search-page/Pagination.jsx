/* eslint-disable prefer-spread */
/**
 * Created by Wayuki on 16-Sep-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ currentPage, pages, size, handlePaginationClick }) => {
  const prevNumPages = Array.apply(
    null,
    new Array(currentPage - 1 > size - 1 ? size - 1 : currentPage - 1),
  ).map((x, i) => currentPage - i - 1).sort();
  const nextNumPages = Array.apply(
    null,
    new Array(pages - currentPage > size - 1 ? size - 1 : pages - currentPage),
  ).map((x, i) => i + currentPage + 1);
  const pag = [currentPage];
  while ((prevNumPages.length > 0 || nextNumPages.length > 0) && pag.length < size) {
    if (nextNumPages.length > 0) {
      pag.push(nextNumPages.shift());
    }
    if (prevNumPages.length > 0) {
      pag.unshift(prevNumPages.pop());
    }
  }
  return (
    <ul className="pagination justify-content-center">
      {
        currentPage === 1 ? (
          null
        ) : (
          <li className="page-item">
            <a
              className="page-link"
              onClick={() => handlePaginationClick(currentPage - 1)}
              role="link"
              tabIndex="-1"
            >
              <span>&laquo;</span>
              <span className="sr-only">Previous</span>
            </a>
          </li>
        )
      }
      {
        pag.map(page => (
          <li key={page} className={`page-item${page === currentPage ? ' active' : ''}`}>
            <a
              className="page-link"
              onClick={() => handlePaginationClick(page)}
              role="link"
              tabIndex="-1"
            >{ page }</a>
          </li>
        ))
      }
      {
        currentPage === pages ? (
          null
        ) : (
          <li className="page-item">
            <a
              className="page-link"
              onClick={() => handlePaginationClick(currentPage + 1)}
              role="link"
              tabIndex="-1"
            >
              <span>&raquo;</span>
              <span className="sr-only">Next</span>
            </a>
          </li>
        )
      }
    </ul>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  pages: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  handlePaginationClick: PropTypes.func.isRequired,
};

export default Pagination;
