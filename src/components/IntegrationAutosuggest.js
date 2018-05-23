import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import SuggestionItem from './SuggestionItem';

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
  return <SuggestionItem suggestion={suggestion} query={query} isHighlighted={isHighlighted} />;
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
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

  const handleOnSuggestionSelected = () => props.fetchResults();

  const handleOnKeyDown = (event) => {
    if (event.key === 'Enter') {
      props.fetchResults();
    }
  };

  const { classes } = props;

  //console.log('IntegrationAutosuggest', props);

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
      renderInputComponent={renderInput}
      suggestions={props.search.suggestions}
      onSuggestionsClearRequested={props.clearSuggestions}
      onSuggestionsFetchRequested={props.fetchSuggestions}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={handleOnSuggestionSelected}
      inputProps={{
        classes,
        placeholder: 'Search place names',
        value: props.search.query,
        onChange: handleOnChange,
        onKeyDown: handleOnKeyDown
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
  fetchResults: PropTypes.func.isRequired,
};

export default withStyles(styles)(IntegrationAutosuggest);
