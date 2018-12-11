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
    flexGrow: 1,
    //position: 'absolute',
    //top: 64,
    //backgroundColor: 'rgb(238, 238, 238)',
  },
};

class ViewTabs extends React.Component {
  constructor(props) {
    super(props);
    let value = this.pathnameToValue(this.props.routeProps.location.pathname);
    this.state = { value };
  }

  componentDidUpdate = prevProps => {
    const newPath = this.props.routeProps.location.pathname;
    const oldPath = prevProps.routeProps.location.pathname;
    if (newPath != oldPath) {
      this.setState({ value: this.pathnameToValue(newPath) });
    }
  }

  pathnameToValue = pathname => {
    let value;
    switch (pathname) {
      case '/manuscripts/production_places':
        value = 1;
        break;
      case '/manuscripts/migrations':
        value = 2;
        break;
      case '/manuscripts/statistics':
        value = 3;
        break;
      default:
        value = 0;
    }
    return value;
  }

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
          indicatorColor="secondary"
          textColor="secondary"
          fullWidth
        >
          <Tab icon={<CalendarViewDayIcon />} label="manuscripts table" component={Link} to="/manuscripts" />
          <Tab icon={<AddLocationIcon />} label="production places" component={Link} to="/manuscripts/production_places" />
          <Tab icon={<RedoIcon />} label="migrations" component={Link} to="/manuscripts/migrations" />
          <Tab icon={<PieChartIcon />} label="statistics" component={Link} to="/manuscripts/statistics"/>
        </Tabs>
      </Paper>
    );
  }
}

ViewTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(ViewTabs);
