/**
 * Created by Wayuki on 12-Aug-17.
 */
import React from 'react';
import PropTypes from 'prop-types';
import AutoComplete from 'react-autocomplete';

const Search = ({ query, suggestions, onQueryChange, onFormSubmit }) => {
  let submitBtn;
  return (
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
                <div className={`suggestion ${isHighlighted ? 'highlighted' : ''}`}>{item.label}</div>
              )}
              renderMenu={items => (
                <div className="suggestions-menu">
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
              onSelect={(val) => {
                onQueryChange(val);
                submitBtn.click();
              }}
            />
            <button
              className="btn btn-outline-primary btn-submit input-group-addon"
              type="submit"
              ref={(btn) => { submitBtn = btn; }}
              title="Submit Search Query"
            >
              <i className="fa fa-search" /> <span>Search</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

Search.propTypes = {
  query: PropTypes.string.isRequired,
  suggestions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
  })).isRequired,
  onQueryChange: PropTypes.func.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
};

export default Search;
