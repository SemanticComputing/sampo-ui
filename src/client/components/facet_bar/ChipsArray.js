import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';
//import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    //padding: theme.spacing.unit / 2,
  },
  chip: {
    margin: theme.spacing.unit / 2,
  },
});

class ChipsArray extends React.Component {

  handleDelete = data => () => {
    console.log(data);
  };

  render() {
    const { classes, data } = this.props;
    return (
      <div className={classes.root}>
        {data !== null && data.map(item => {
          let icon = null;
          return (
            <Chip
              key={item.key}
              icon={icon}
              label={item.label}
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
  data: PropTypes.array,
};

export default withStyles(styles)(ChipsArray);
