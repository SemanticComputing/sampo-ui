import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: ref,
        classes: {
          input: classes.input,
        },
        ...other,
      }}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <strong key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          ) : (
            <span key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          );
        })}
      </div>
    </MenuItem>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.dataset}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.results;
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1500,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
    maxHeight: 500,
    overflow: 'auto',
  },
  sectionContainer: {
    borderTop: '1px dashed #ccc',
  },
  sectionContainerFirst: {
    borderTop: 0,
  }
});

const IntegrationAutosuggest = (props) => {

  const handleOnChange = (event, { newValue }) => props.updateQuery(newValue);

  const { classes } = props;

  // console.log('IntegrationAutosuggest', props);

  return (
    <Autosuggest
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
        sectionContainer : classes.sectionContainer,
        sectionContainerFirst : classes.sectionContainerFirst,
      }}
      multiSection={true}
      renderInputComponent={renderInput}
      suggestions={props.search.suggestions}
      onSuggestionsClearRequested={props.clearSuggestions}
      onSuggestionsFetchRequested={props.fetchSuggestions}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSectionTitle={renderSectionTitle}
      getSectionSuggestions={getSectionSuggestions}
      renderSuggestion={renderSuggestion}
      inputProps={{
        classes,
        placeholder: 'Search place names',
        value: props.search.query,
        onChange: handleOnChange,
      }}
    />
  );
};

IntegrationAutosuggest.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  updateQuery: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);
