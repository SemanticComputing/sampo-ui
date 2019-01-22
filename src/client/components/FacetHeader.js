import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
//import MoreVertIcon from '@material-ui/icons/MoreVert';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import { PieChart, ExpandLess, /*ExpandMore*/ }  from '@material-ui/icons';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const options = [
  'Sort alphabetically',
  'Sort by manuscript count',
];

const styles = theme => ({
  root: {
    width: '100%',
    height: '100%'
  },
  headingContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing.unit,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  facetContainer: {
    marginBottom: theme.spacing.unit,
  },
  facetContainerLast: {
    marginBottom: 2,
  },
  facetValuesContainerTen: {
    height: 345,
    padding: theme.spacing.unit,
  },
  facetValuesContainerThree: {
    height: 108,
    padding: theme.spacing.unit,
  },
  facetHeaderButtons: {
    marginLeft: 'auto'
  }
});

class FacetHeader extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <Paper className={classes.headingContainer}>
        <Typography variant="h6">{this.props.label} {this.props.distinctValueCount > 0 ? `(${this.props.distinctValueCount})` : ''}</Typography>
        <div className={classes.facetHeaderButtons}>
          <IconButton disabled aria-label="Statistics">
            <PieChart />
          </IconButton>
          <IconButton
            aria-label="More"
            aria-owns={open ? 'long-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleClick}
          >
            <SortByAlphaIcon />
          </IconButton>
          <Menu
            id="long-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={this.handleClose}
          >
            {options.map(option => (
              <MenuItem key={option} selected={option === 'Pyxis'} onClick={this.handleClose}>
                {option}
              </MenuItem>
            ))}
          </Menu>
          <IconButton disabled aria-label="Expand">
            <ExpandLess />
          </IconButton>
        </div>
      </Paper>
    );
  }
}

FacetHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  distinctValueCount: PropTypes.number.isRequired
};

export default withStyles(styles)(FacetHeader);
