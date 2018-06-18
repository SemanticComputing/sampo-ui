import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import CommentIcon from '@material-ui/icons/Comment';
import ListSubheader from '@material-ui/core/ListSubheader';

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
  //onClick={props.updateDatasets(dataset.id)}

  const handleOnChange = (value) => {
    props.updateDatasets(value);
  };

  return (
    <div className={classes.root}>
      <List subheader={<ListSubheader>Select data sources</ListSubheader>}>
        {props.datasets.map(dataset => (
          <ListItem
            key={dataset.id}
            role={undefined}
            dense
            button
            onClick={handleOnChange}
            className={classes.listItem}
          >
            <Checkbox
              checked={dataset.selected}
              tabIndex={-1}
              disableRipple
            />
            <ListItemText primary={dataset.id} />
            <ListItemSecondaryAction>
              <IconButton aria-label="Comments">
                <CommentIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

DatasetSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  datasets: PropTypes.array.isRequired,
  updateDatasets: PropTypes.func.isRequired
};

export default withStyles(styles)(DatasetSelector);
