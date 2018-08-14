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


import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



const styles = theme => ({
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
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
  group: {
    margin: `${theme.spacing.unit}px 0`,
  },
});

class TopBar extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleChange = event => {
    this.props.updateMapMode(event.target.value);
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
            <FormControl component="fieldset" className={classes.formControl}>
              <FormLabel component="legend">Map mode</FormLabel>
              <RadioGroup
                aria-label="Map mode"
                name="map"
                className={classes.group}
                value={this.props.mapMode}
                onChange={this.handleChange}
              >
                <FormControlLabel value="cluster" control={<Radio />} label="Clustered markers" />
                <FormControlLabel value="noCluster" control={<Radio />} label="Markers" />
                <FormControlLabel value="heatmap" control={<Radio />} label="Heatmap" />
              </RadioGroup>
            </FormControl>
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
  mapMode: PropTypes.string.isRequired,
  updateMapMode: PropTypes.func.isRequired,
};

export default withStyles(styles)(TopBar);
