import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
import Tooltip from '@material-ui/core/Tooltip';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  chip: {
    margin: theme.spacing(0.5),
  },
});

class ChipsArray extends React.Component {

  handleDelete = item => () => {
    if (!this.props.someFacetIsFetching) {
      switch(item.filterType) {
        case 'uriFilter':
          this.props.updateFacetOption({
            facetClass: this.props.facetClass,
            facetID: item.facetID,
            option: item.filterType,
            value: item.value
          });
          break;
        case 'textFilter':
          this.props.updateFacetOption({
            facetClass: this.props.facetClass,
            facetID: item.facetID,
            option: item.filterType,
            value: null
          });
          break;
        case 'timespanFilter': {    
          this.props.updateFacetOption({
            facetClass: this.props.facetClass,
            facetID: item.facetID,
            option: item.filterType,
            value: null
          });
          this.props.fetchFacet({
            facetClass: this.props.facetClass,
            facetID: item.facetID,
          });
        }
      }
    }
  };

  generateLabel = (facetLabel, valueLabel, filterType) => {
    return  filterType !== 'timespanFilter' && valueLabel.length > 18
      ? `${facetLabel}: ${valueLabel.substring(0, 18)}...`
      : `${facetLabel}: ${valueLabel}`;
  }

  ISOStringToYear = str => {
    let year = null;
    if (str.charAt(0) == '-') {
      year = parseInt(str.substring(0,5));
    } else {
      year = parseInt(str.substring(0,4));
    }
    return year;
  }

  render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.root}>
        {data !== null && data.map(item => {
          let icon = null;
          let key = null;
          let valueLabel = null;
          if (item.filterType === 'uriFilter') {
            key = item.value.node.id;
            valueLabel = item.value.node.prefLabel;
          }
          if (item.filterType === 'textFilter') {
            key = item.value;
            valueLabel = item.value;
          }
          if (item.filterType === 'timespanFilter') {
            key = item.facetID;
            valueLabel = `${this.ISOStringToYear(item.value.start)} to
              ${this.ISOStringToYear(item.value.end)}`;
          }
          return (
            <Tooltip key={key} title={`${item.facetLabel}: ${valueLabel}`}>
              <Chip
                key={key}
                icon={icon}
                label={this.generateLabel(item.facetLabel, valueLabel, item.filterType)}
                className={classes.chip}
                onDelete={this.handleDelete(item)}
                color="primary"
              />
            </Tooltip>

          );
        })}
      </div>
    );
  }
}

ChipsArray.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  facetClass: PropTypes.string.isRequired,
  updateFacetOption: PropTypes.func.isRequired,
  someFacetIsFetching: PropTypes.bool.isRequired,
  fetchFacet: PropTypes.func.isRequired
};

export default withStyles(styles)(ChipsArray);
