import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import SuggestionItem from './SuggestionItem';
import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';

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
  return suggestion;
}

const styles = theme => ({
  container: {
    flexGrow: 0,
    position: 'relative',
    marginTop: theme.spacing.unit * 2,
    // paddingLeft: theme.spacing.unit * 15,
    // paddingRight: theme.spacing.unit * 15,
    marginLeft: 24,
    //marginRight: 'auto',
    width: 280,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1500,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 300,
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
  icon: {
    color: theme.palette.text.secondary,
    //paddingTop: 4,
  },
  spinner: {
    //margin: theme.spacing.unit,
  }
});

const IntegrationAutosuggest = (props) => {

  let autosuggestDOM = React.createRef();

  const handleOnChange = (event, { newValue }) => {
    props.clearSuggestions();
    props.updateQuery(newValue);
  };

  const handleOnSuggestionSelected = () => {
    searchPlaces();
  };

  const handleOnKeyDown = (event) => {
    if (event.key === 'Enter') {
      searchPlaces();
    }
  };

  const handleClickSearchButton = () => {
    searchPlaces();
  };

  const handleMouseDownSearchButton = (event) => {
    event.preventDefault();
  };

  const searchPlaces = () => {
    if (props.search.query.length > 0) {
      console.log('fetching results');
      autosuggestDOM.current.input.blur();
      props.clearResults();
      props.fetchResults();
    }
  };

  // const handleOnBlur = (event, { highlightedSuggestion }) => {
  //   // console.log(event);
  //   // console.log(highlightedSuggestion);
  // };

  const handleOnSuggestionsFetchRequested = ({ value }) => {
    if (props.search.suggestionsQuery != value || props.search.suggestions.length === 0) {
      console.log('fetching suggestions');
      props.fetchSuggestions();
    }
    else {
      console.log('using old suggestions');
    }
  };

  const shouldRenderSuggestions = (value)  => {
    return value.trim().length > 3;
  };

  const handleOnSuggestionsClearRequested = () => {
    //console.log('SuggestionsClearRequested');
    //props.clearSuggestions();
  };

  const { classes } = props;
  //console.log('IntegrationAutosuggest', props.search.suggestions);

  let adornment = null;
  if (props.search.fetchingSuggestions || props.search.fetchingResults) {
    adornment =
    <InputAdornment position="end">
      <IconButton
        aria-label="Search places"
      >
        <CircularProgress size={24} />
      </IconButton>
    </InputAdornment>;
  } else {
    adornment =
    <InputAdornment position="end">
      <IconButton
        aria-label="Search places"
        onClick={handleClickSearchButton}
        onMouseDown={handleMouseDownSearchButton}
      >
        <SearchIcon className={classes.icon} />
      </IconButton>
    </InputAdornment>;
  }

  return (
    <Autosuggest
      theme={{
        container: classes.container,
        suggestionsContainerOpen: classes.suggestionsContainerOpen,
        suggestionsList: classes.suggestionsList,
        suggestion: classes.suggestion,
      }}
      renderInputComponent={renderInput}
      suggestions={props.search.suggestions}
      shouldRenderSuggestions={shouldRenderSuggestions}
      onSuggestionsFetchRequested={handleOnSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleOnSuggestionsClearRequested}
      renderSuggestionsContainer={renderSuggestionsContainer}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      onSuggestionSelected={handleOnSuggestionSelected}
      focusInputOnSuggestionClick={false}
      ref={autosuggestDOM}
      inputProps={{
        classes,
        placeholder: 'Search place names',
        value: props.search.query,
        onChange: handleOnChange,
        onKeyDown: handleOnKeyDown,
        autoFocus: true,
        endAdornment: adornment
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
  clearResults: PropTypes.func.isRequired
};

export default withStyles(styles)(IntegrationAutosuggest);
