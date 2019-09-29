import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { YearToISOString, ISOStringToYear } from './FacetHelpers';

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
  },
  textFields: {
    marginRight: theme.spacing(2)
  },
  textField: {
    display: 'block'
  },
  applyButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing(1.5),
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
});

class RangeFacet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      min: '',
      max: ''
    };
  }

  componentDidMount = () => {
    const { isFetching, min, max } = this.props.facet;
    if (!isFetching && (min == null || max == null)) {
      this.props.fetchFacet({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
      });
    }
  }

  handleMinChange = event => {
    this.setState({ min: event.target.value });
  }

  handleMaxChange = event => {
    this.setState({ max: event.target.value });
  }

  handleApplyOnClick = event => {
    let { min, max } = this.state;
    let values = [ min, max ];
    if (this.props.dataType === 'ISOString') {
      values[0] = YearToISOString({ year: values[0], start: true });
      values[1] = YearToISOString({ year: values[1], start: false });
    }
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: this.props.facetID,
      option: this.props.facet.filterType,
      value: values
    });
    event.preventDefault();
  }

  render() {
    const { classes, someFacetIsFetching } = this.props;
    const { isFetching, min, max } = this.props.facet;
    let domain = null;
    let values = null;
    if (isFetching || min == null || max == null) {
      return(
        <div className={classes.spinnerContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      );
    } else {
      if (this.props.dataType === 'ISOString') {
        const minYear = this.ISOStringToYear(min);
        const maxYear = this.ISOStringToYear(max);
        domain = [ minYear, maxYear ];
        if (this.props.facet.timespanFilter == null) {
          values = domain;
        } else {
          const { start, end } = this.props.facet.timespanFilter;
          values = [ this.ISOStringToYear(start), this.ISOStringToYear(end) ];
        }
      } else if (this.props.dataType === 'integer') {
        domain = [ parseInt(min), parseInt(max) ];
        if (this.props.facet.integerFilter == null) {
          values = domain;
        } else {
          const { start, end } = this.props.facet.integerFilter;
          values = [ start, end ];
        }
      }

      return (
        <div className={classes.root}>
          <div className={classes.textFields}>
            <TextField
              id="standard-number"
              label="Min"
              disabled={someFacetIsFetching}
              value={this.state.min}
              onChange={this.handleMinChange}
              type="number"
              variant="outlined"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
            <TextField
              id="standard-number"
              label="Max"
              disabled={someFacetIsFetching}
              value={this.state.max}
              onChange={this.handleMaxChange}
              type="number"
              variant="outlined"
              className={classes.textField}
              InputLabelProps={{
                shrink: true,
              }}
              margin="normal"
            />
          </div>
          <div className={classes.applyButton}>
            <Button
              variant="contained"
              color="primary"
              className={classes.button}
              onClick={this.handleApplyOnClick}
              disabled={this.state.min === '' && this.state.max === ''}
            >
              apply
            </Button>
          </div>
        </div>
      );
    }
  }
}


RangeFacet.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string.isRequired,
  facet: PropTypes.object.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  someFacetIsFetching: PropTypes.bool.isRequired,
  updateFacetOption: PropTypes.func,
  facetUpdateID: PropTypes.number,
  updatedFilter: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  updatedFacet: PropTypes.string,
  dataType: PropTypes.string.isRequired
};

export default withStyles(styles)(RangeFacet);
