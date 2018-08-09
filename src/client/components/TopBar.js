import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import NavTabs from '../components/NavTabs';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';

import Switch from '@material-ui/core/Switch';
import WifiIcon from '@material-ui/icons/Wifi';
import BluetoothIcon from '@material-ui/icons/Bluetooth';


const styles = () => ({
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuList: {
    width: 350
  }
});

class TopBar extends React.Component {
  state = {
    anchorEl: null,
    checked: ['cluster'],
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleToggle = value => () => {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked,
    });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    return (
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={this.handleClick}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleClose}
          >
            <MenuList className={classes.menuList}>
              <MenuItem>
                <ListItemIcon>
                  <WifiIcon />
                </ListItemIcon>
                <ListItemText primary="Cluster markers" />
                <ListItemSecondaryAction>
                  <Switch
                    onChange={this.handleToggle('cluster')}
                    checked={this.state.checked.indexOf('cluster') !== -1}
                  />
                </ListItemSecondaryAction>
              </MenuItem>
            </MenuList>
          </Menu>
          <Typography variant="title" color="inherit" className={classes.flex}>
            NameSampo
          </Typography>
          {this.props.oneColumnView && <NavTabs /> }
        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  oneColumnView: PropTypes.bool.isRequired,
};

export default withStyles(styles)(TopBar);
