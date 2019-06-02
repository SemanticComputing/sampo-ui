import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

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

  handleDelete = data => () => {
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: data.facetID,
      option: data.filterType,
      value: data.value  // a react sortable tree object
    });
  };

  generateLabel = (facetLabel, valueLabel) => {
    return  valueLabel.length > 18
      ? `${facetLabel}: ${valueLabel.substring(0, 18)}...`
      : `${facetLabel}: ${valueLabel}`;
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
          return (
            <Chip
              key={key}
              icon={icon}
              label={this.generateLabel(item.facetLabel, valueLabel)}
              className={classes.chip}
            />
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
  updateFacetOption: PropTypes.func.isRequired
};

export default withStyles(styles)(ChipsArray);
