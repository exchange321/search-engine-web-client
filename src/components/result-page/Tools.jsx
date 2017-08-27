/**
 * Created by Wayuki on 26-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

const Tools = ({ fullscreen, handleFullScreenClick, handlePrevClick, handleNextClick }) => (
  <div className={`tools ${fullscreen ? 'full-screen' : ''}`}>
    <button className="btn btn-secondary mx-1" onClick={handleFullScreenClick}>
      {
        fullscreen ? (
          <span><span className="hidden-sm-down">Restore</span> <i className="fa fa-window-restore" /></span>
        ) : (
          <span><span className="hidden-sm-down">Full Screen</span> <i className="fa fa-arrows-alt" /></span>
        )
      }
    </button>
    <div className="btn-group mx-1">
      <button className="btn btn-secondary" onClick={handlePrevClick}><i className="fa fa-angle-left" /> <span className="hidden-sm-down">Previous Result</span></button>
      <button className="btn btn-secondary" onClick={handleNextClick}><span className="hidden-sm-down">Next Result</span> <i className="fa fa-angle-right" /></button>
    </div>
  </div>
);

Tools.propTypes = {
  fullscreen: PropTypes.bool.isRequired,
  handleFullScreenClick: PropTypes.func.isRequired,
  handlePrevClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
};

export default Tools;
