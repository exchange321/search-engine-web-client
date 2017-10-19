/* eslint-disable no-extend-native,func-names */
/**
 * Created by Wayuki on 13-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import dummyImage from '../../images/no-image.gif';

String.prototype.lastIndexOfRegex = function (regex, fromIndex) {
  const str = fromIndex ? this.substring(0, fromIndex) : this;
  const match = str.match(regex);
  return match ? str.lastIndexOf(match[match.length - 1]) : -1;
};

const SearchResult = ({ id, result, onResultClick }) => {
  const { _source: { description, image, url } } = result;
  let { _source: { title } } = result;
  if (title.length < 1) {
    title = url;
  }
  const width = document.body.offsetWidth;
  let titleCount = 0;
  let descCount = 0;
  if (width < 768) {
    titleCount = 30;
    descCount = 100;
  } else if (width < 992) {
    titleCount = 40;
    descCount = 120;
  } else if (width < 1200) {
    titleCount = 80;
    descCount = 150;
  } else if (width >= 1200) {
    titleCount = 90;
    descCount = 250;
  }
  return (
    <div className="search-result">
      <div className="img-container">
        <div className="img-res">
          <div className="img-res-inner" style={{ backgroundImage: `url(${image.length < 1 ? dummyImage : image})` }}>
            <img src={image.length < 1 ? dummyImage : image} className="hidden-xs-up" alt={title} />
          </div>
        </div>
      </div>
      <div className="text-container">
        <div className="result-title-container">
          <a
            href={url}
            className="h5 result-title"
            title={title}
            onClick={e => onResultClick(e, result, id)}
          >
            {
              title.length > titleCount ? `${title.slice(0, title.lastIndexOfRegex(/\W+/gi, titleCount - 2))} ...` : title
            }
          </a>
        </div>
        <cite className="result-url" title={url}>
          {
            url.length > 47 ?
              (
                `${url.slice(0, url.indexOf('/', 9))}/...${url.slice(url.lastIndexOf('/', url.length - 2)).length > 20 ? `${url.slice(url.lastIndexOf('/', url.length - 2), url.lastIndexOf('/', url.length - 2) + 17)}...` : url.slice(url.lastIndexOf('/', url.length - 2))}`
              ) : url
          }
        </cite>
        <p className="result-description">
          {
            description.length > descCount ? `${description.slice(0, description.lastIndexOfRegex(/\W+/gi, descCount - 2))} ...` : description
          }
        </p>
      </div>
    </div>
  );
};

SearchResult.propTypes = {
  id: PropTypes.number.isRequired,
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
  onResultClick: PropTypes.func.isRequired,
};

export default SearchResult;
