/**
 * Created by Wayuki on 26-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';

const Tools = ({
  evaluationMode,
  fullscreen,
  handleFullScreenClick,
  handleNextClick,
  handleCompletedClick,
}) => (
  <div className={`tools ${fullscreen ? 'full-screen' : ''}`}>
    <div className="btn-group btn-group-lg">
      {
        evaluationMode ? (
          <button className="btn btn-secondary" onClick={handleCompletedClick}>
            <span><span className="hidden-sm-down">Completed</span> <span><i className="fa fa-check" /></span></span>
          </button>
        ) : null
      }
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
  evaluationMode: PropTypes.bool.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  handleFullScreenClick: PropTypes.func.isRequired,
  handleNextClick: PropTypes.func.isRequired,
  handleCompletedClick: PropTypes.func.isRequired,
};

export default Tools;
