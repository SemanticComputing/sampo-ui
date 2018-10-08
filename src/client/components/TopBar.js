import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import NavTabs from '../components/NavTabs';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { CSVLink } from 'react-csv';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  toolBar: {
    display: 'flex',
    justifyContent: 'flex-start',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  menuContent: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 350,
    outline: 0,
    padding: theme.spacing.unit * 3
  },
  formControl: {
    marginBottom: theme.spacing.unit * 3,
  },
  formGroup: {
    margin: `${theme.spacing.unit}px 0`,
  },
  csvButton: {
    margin: theme.spacing.unit * 3,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
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
});

class TopBar extends React.Component {
  state = {
    anchorEl: null,
  };

  componentDidMount() {
    this.props.fetchResults();
    this.props.fetchManuscripts(0);
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleChange = event => {
    this.props.updateMapMode(event.target.value);
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleToggleDataset = value => () => {
    this.props.toggleDataset(value);
  };

  render() {
    const { anchorEl } = this.state;
    const { classes } = this.props;

    //  <FormControlLabel value="heatmap" control={<Radio />} label="Heatmap" />
    //
    // <CSVLink data={this.props.results}>
    //   <Button variant="contained" color="primary" className={classes.button}>
    //     Results as CSV
    //     <CloudDownloadIcon className={classes.rightIcon} />
    //   </Button>
    // </CSVLink>

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
            <div className={classes.menuContent}>


              <FormControl component="fieldset" className={classes.formControl}>
                <FormLabel component="legend">Map mode</FormLabel>
                <RadioGroup
                  className={classes.formGroup}
                  aria-label="Map mode"
                  name="map"
                  value={this.props.mapMode}
                  onChange={this.handleChange}
                >
                  <FormControlLabel value="cluster" control={<Radio />} label="Clustered markers" />
                  <FormControlLabel value="noCluster" control={<Radio />} label="Markers" />

                </RadioGroup>
              </FormControl>



            </div>

          </Menu>
          {/* <img className={classes.namesampoLogo} src='img/logos/namesampo.png' alt='NameSampo logo'/> */}
          <Typography variant="h6" color="inherit" className={classes.flex}>
            Mapping Manuscript Migrations
          </Typography>
          {this.props.oneColumnView &&
            <div className={classes.navTabs}>
              <NavTabs
                resultFormat={this.props.resultFormat}
                updateResultFormat={this.props.updateResultFormat}
              />
            </div>
          }
        </Toolbar>
      </AppBar>
    );
  }
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
  //results: PropTypes.array.isRequired,
  oneColumnView: PropTypes.bool.isRequired,
  mapMode: PropTypes.string.isRequired,
  resultFormat: PropTypes.string.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  updateResultFormat: PropTypes.func.isRequired,
  updateMapMode: PropTypes.func.isRequired,
  datasets: PropTypes.object.isRequired,
  toggleDataset: PropTypes.func.isRequired,
};

export default withStyles(styles)(TopBar);
