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
    margin: theme.spacing.unit / 2,
  },
});

class ChipsArray extends React.Component {

  handleDelete = data => () => {
    this.props.updateFacetOption({
      facetClass: this.props.facetClass,
      facetID: data.facetID,
      option: data.filterType,
      value: data.value
    });
  };

  render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.root}>
        {data !== null && data.map(item => {
          let icon = null;
          return (
            <Chip
              key={item.value.id}
              icon={icon}
              label={`${item.facetLabel.toLowerCase()}: ${item.value.label}`}
              onDelete={this.handleDelete(item)}
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
