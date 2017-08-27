/**
 * Created by Wayuki on 26-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import loader from '../../images/gif-loader.gif';

const LoaderBlock = ({ message }) => (
  <div className="loader-block">
    <div className="img-container">
      <img src={loader} alt="Loading..." />
    </div>
    <div className="text-container">
      <p className="lead">{ message }</p>
    </div>
  </div>
);

LoaderBlock.propTypes = {
  message: PropTypes.string.isRequired,
};

export default LoaderBlock;
