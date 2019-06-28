import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { has } from 'lodash';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import RedoIcon from '@material-ui/icons/Redo';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';


const styles = () => ({
  root: {
    flexGrow: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

class PerspectiveTabs extends React.Component {
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
    return has(this.props.tabs, pathname) ? this.props.tabs[pathname].value : 0;
  }

  renderIcon = iconString => {
    let icon = '';
    switch (iconString) {
      case 'CalendarViewDay':
        icon = <CalendarViewDayIcon />;
        break;
      case 'AddLocation':
        icon = <AddLocationIcon />;
        break;
      case 'Redo':
        icon = <RedoIcon />;
        break;
      case 'Download':
        icon = <CloudDownloadIcon />;
        break;
    }
    return icon;
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, tabs } = this.props;
    return (
      <Paper className={classes.root}>
        <Tabs
          value={this.state.value}
          onChange={this.handleChange}
          indicatorColor="secondary"
          textColor="secondary"
          variant="fullWidth"
        >
          {Object.keys(tabs).map(key =>
            <Tab key={key} icon={this.renderIcon(tabs[key].icon)} label={tabs[key].label} component={Link} to={key} />
          )}
        </Tabs>
      </Paper>
    );
  }
}

PerspectiveTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
};

export default withStyles(styles)(PerspectiveTabs);
