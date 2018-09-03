import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing.unit,
  },
  withoutLabel: {
    marginTop: theme.spacing.unit * 3,
  },
  textField: {
    flexBasis: 200,
  },
});

class SearchField extends React.Component {
  state = {
    value: '',
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleMouseDown = (event) => {
    event.preventDefault();
  };

  handleOnKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.props.updateQuery(this.state.value);
      this.props.clearResults();
      this.props.fetchResults();
    }
  };

  handleClick = () => {
    //this.props.updateQuery(this.state.value);
    this.props.clearResults();
    this.props.fetchAllResults();
  };

  render() {
    const { classes } = this.props;

    let searchButton = null;
    if (this.props.search.fetchingSuggestions || this.props.search.fetchingResults) {
      searchButton = (
        <IconButton
          aria-label="Search places"
        >
          <CircularProgress size={24} />
        </IconButton>
      );
    } else {
      searchButton = (
        <IconButton
          aria-label="Search"
          onClick={this.handleClick}
          onMouseDown={this.handleMouseDown}
        >
          <SearchIcon />
        </IconButton>
      );
    }

    return (
      <div className={classes.root}>
        <FormControl className={classNames(classes.margin, classes.textField)}>
          <InputLabel htmlFor="adornment-search">Search place names</InputLabel>
          <Input
            id="adornment-search"
            type='text'
            value={this.state.value}
            onChange={this.handleChange}
            onKeyDown={this.handleOnKeyDown}
            endAdornment={
              <InputAdornment position="end">
                {searchButton}
              </InputAdornment>
            }
          />
        </FormControl>
      </div>
    );
  }
}

SearchField.propTypes = {
  classes: PropTypes.object.isRequired,
  search: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired
};

export default withStyles(styles)(SearchField);
