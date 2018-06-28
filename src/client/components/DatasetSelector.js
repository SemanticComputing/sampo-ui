import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    width: '100%',
    //maxWidth: 360,
    backgroundColor: theme.palette.background.default,
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  }
});

const DatasetSelector = props => {

  const { classes } = props;

  const handleToggle = value => () => {
    props.toggleDataset(value);
  };

  return (
    <div className={classes.root}>
      <List>
        {Object.keys(props.datasets).map(id => (
          <ListItem
            key={id}
            role={undefined}
            dense
            button
            onClick={handleToggle(id)}
            className={classes.listItem}
          >
            <Checkbox
              checked={props.datasets[id].selected}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={props.datasets[id].title} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

DatasetSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  toggleDataset: PropTypes.func.isRequired
};

export default withStyles(styles)(DatasetSelector);
