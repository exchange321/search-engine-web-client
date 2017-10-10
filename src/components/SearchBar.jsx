/* eslint-disable react/jsx-boolean-value */
/**
 * Created by Wayuki on 12-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'react-autocomplete';
import { UncontrolledButtonDropdown, DropdownToggle, DropdownItem, DropdownMenu } from 'reactstrap';

const Search = ({
  pathname,
  resDisMode,
  navDisMode,
  evaluationMode,
  query,
  suggestions,
  onQueryChange,
  onFormSubmit,
  onResultModeClick,
  onNavModeClick,
  onEvaluationClick,
}) => (
  <div className="search">
    <form
      onSubmit={(e) => {
        onFormSubmit(e);
      }}
    >
      <div className="form-group">
        <label htmlFor="query" className="sr-only">Search Query</label>
        <div className="input-group">
          <AutoComplete
            getItemValue={item => item.label}
            autoHighlight={false}
            inputProps={{
              type: 'text',
              id: 'query',
              name: 'query',
              className: 'form-control',
            }}
            wrapperStyle={{}}
            wrapperProps={{
              className: 'search-wrapper',
            }}
            items={suggestions}
            renderItem={(item, isHighlighted) => (
              <div
                role="option"
                aria-selected={isHighlighted ? 'true' : 'false'}
                className={`suggestion ${isHighlighted ? 'highlighted' : ''}`}
              >{item.label}</div>
            )}
            renderMenu={items => (
              <div className="suggestions-menu" role="listbox">
                {items.map(item => ({
                  ...item,
                  key: suggestions.filter(suggestion => (
                    suggestion.label === item.props.children
                  ))[0].key,
                }))}
              </div>
            )}
            value={query}
            onChange={e => onQueryChange(e.target.value)}
            onSelect={onQueryChange}
          />
          <button
            className="btn btn-outline-primary btn-submit input-group-addon"
            type="submit"
            title="Submit Search Query"
            disabled={evaluationMode}
          >
            <i className="fa fa-search" /> <span>Search</span>
          </button>
          <UncontrolledButtonDropdown>
            <DropdownToggle disabled={evaluationMode}>
              <i className="fa fa-ellipsis-v" />
            </DropdownToggle>
            {
              pathname !== '/result' && !evaluationMode ? (
                <DropdownMenu right>
                  <DropdownItem onClick={onResultModeClick}>ResDis - Switch to { resDisMode ? 'Classic' : 'Custom' }</DropdownItem>
                  <DropdownItem onClick={onNavModeClick}>NavDis - Switch to { navDisMode ? 'Notification' : 'iFrame' }</DropdownItem>
                  {
                    pathname === '/search' && !evaluationMode ? (
                      <DropdownItem onClick={onEvaluationClick}>Start Evaluation</DropdownItem>
                    ) : null
                  }
                </DropdownMenu>
              ) : (
                <DropdownMenu right>
                  <DropdownItem disabled>No Setting Available</DropdownItem>
                </DropdownMenu>
              )
            }
          </UncontrolledButtonDropdown>
        </div>
      </div>
    </form>
  </div>
);

Search.propTypes = {
  pathname: PropTypes.string.isRequired,
  resDisMode: PropTypes.bool.isRequired,
  navDisMode: PropTypes.bool.isRequired,
  evaluationMode: PropTypes.bool.isRequired,
  query: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onResultModeClick: PropTypes.func.isRequired,
  onNavModeClick: PropTypes.func.isRequired,
  onEvaluationClick: PropTypes.func.isRequired,
};

export default Search;
