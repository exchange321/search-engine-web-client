/**
 * Created by Wayuki on 26-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

const Tools = ({ fullscreen, handleFullScreenClick, handlePrevClick, handleNextClick }) => (
  <div className={`tools ${fullscreen ? 'full-screen' : ''}`}>
    <div className="btn-group btn-group-lg">
      <button className="btn btn-secondary" onClick={handlePrevClick}><span className="icon-container icon-left"><i className="fa fa-arrow-left" /></span> <span className="hidden-sm-down">Prev</span></button>
      <button className="btn btn-secondary" onClick={handleFullScreenClick}>
        {
          fullscreen ? (
            <span><span className="hidden-sm-down">Restore</span> <span><i className="fa fa-window-restore" /></span></span>
          ) : (
            <span><span className="hidden-sm-down">Full Screen</span> <span><i className="fa fa-arrows-alt" /></span></span>
          )
        }
      </button>
      <button className="btn btn-secondary" onClick={handleNextClick}><span className="hidden-sm-down">Next</span> <span className="icon-container icon-right"><i className="fa fa-arrow-right" /></span></button>
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
