import React from 'react';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import RedoIcon from '@material-ui/icons/Redo';
import PieChartIcon from '@material-ui/icons/PieChart';
import { Link } from 'react-router-dom';


const styles = {
  root: {
    width: 'calc(100% - 8px)',
    position: 'absolute',
    top: 64,
    //backgroundColor: 'rgb(238, 238, 238)',
  },
};

class ViewTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper square className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          fullWidth
          indicatorColor="secondary"
          textColor="secondary"
        >
          <Tab icon={<CalendarViewDayIcon />} label="table" component={Link} to="/manuscripts/table" />
          <Tab icon={<AddLocationIcon />} label="creation places" component={Link} to="/manuscripts/creation_places" />
          <Tab icon={<RedoIcon />} label="migrations" component={Link} to="/manuscripts/migrations" />
          <Tab icon={<PieChartIcon />} label="statistics" />
        </Tabs>
      </Paper>
    );
  }
}

ViewTabs.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ViewTabs);
