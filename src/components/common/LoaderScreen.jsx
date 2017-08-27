/**
 * Created by Wayuki on 26-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import loader from '../../images/gif-loader.gif';

const LoaderScreen = ({ message }) => (
  <div className="loader-screen container">
    <div className="img-container">
      <img src={loader} alt="Loading..." />
    </div>
    <div className="text-container">
      <p className="lead">{ message }</p>
    </div>
  </div>
);

LoaderScreen.propTypes = {
  message: PropTypes.string.isRequired,
};

export default LoaderScreen;
