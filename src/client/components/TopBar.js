import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import NavTabs from '../components/NavTabs';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import MenuList from '@material-ui/core/MenuList';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Switch from '@material-ui/core/Switch';
import PlaceIcon from '@material-ui/icons/Place';


const styles = () => ({
  toolBar: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuList: {
    width: 350
  },
  namesampoLogo: {
    marginTop: 4,
    height: 30
  },
  navTabs: {
    marginLeft: 'auto'
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
        <Toolbar className={classes.toolBar}>
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
                  <PlaceIcon />
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
          <img className={classes.namesampoLogo} src='img/logos/namesampo.png' alt='NameSampo logo'/>
          {this.props.oneColumnView &&
            <div className={classes.navTabs}>
              <NavTabs />
            </div>
          }
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
