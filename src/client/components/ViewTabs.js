import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import CalendarViewDayIcon from '@material-ui/icons/CalendarViewDay';
import AddLocationIcon from '@material-ui/icons/AddLocation';
import RedoIcon from '@material-ui/icons/Redo';
import { Link } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';


const styles = () => ({
  root: {
    flexGrow: 1,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
});

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
    return this.props.tabs[pathname].value;
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

ViewTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  routeProps: PropTypes.object.isRequired,
  tabs: PropTypes.object.isRequired
};

export default withStyles(styles)(ViewTabs);
