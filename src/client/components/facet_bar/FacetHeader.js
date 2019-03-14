import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import history from '../../History';

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
    height: 48
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

  handleMenuButtonClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleSortOnClick = (sortBy, isSelected) => () =>  {
    this.setState({ anchorEl: null });
    let sortDirection = '';
    if (isSelected) {
      sortDirection = this.props.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      if (sortBy === 'prefLabel') {
        sortDirection = 'asc';
      } else if (sortBy === 'instanceCount') {
        sortDirection = 'desc';
      }
    }
    this.props.fetchFacet({
      facetClass: this.props.facetClass,
      id: this.props.property,
      sortBy: sortBy,
      sortDirection: sortDirection
    });
  };

  handleFilterTypeOnClick = () => () => {
    this.setState({ anchorEl: null });
    history.push({ pathname: `/${this.props.resultClass}/${this.props.filterType}`});
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  renderFacetMenu = () => {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    let menuButtons = [];
    if (this.props.sortButton) {
      menuButtons.push({
        id: 'prefLabel',
        menuItemText: 'Sort alphabetically',
        selected: this.props.sortBy === 'prefLabel' ? true : false,
        onClickHandler: this.handleSortOnClick
      });
      menuButtons.push({
        id: 'instanceCount',
        menuItemText: `Sort by number of ${this.props.resultClass}`,
        selected: this.props.sortBy === 'instanceCount' ? true : false,
        onClickHandler: this.handleSortOnClick
      });
    }
    if (this.props.spatialFilterButton) {
      menuButtons.push({
        id: 'uriFilter',
        menuItemText: `Filter by name`,
        selected: this.props.filterType === 'uri' ? true : false,
        onClickHandler: this.handleFilterTypeOnClick
      });
      menuButtons.push({
        id: 'spatialFilter',
        menuItemText: `Filter by bounding box`,
        selected: this.props.filterType === 'spatial' ? true : false,
        onClickHandler: this.handleFilterTypeOnClick
      });
    }
    return (
      <React.Fragment>
        <Tooltip disableFocusListener={true} title="Filter options">
          <IconButton
            aria-label="Filter options"
            aria-owns={open ? 'facet-option-menu' : undefined}
            aria-haspopup="true"
            onClick={this.handleMenuButtonClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="facet-option-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={this.handleMenuClose}
        >
          {menuButtons.map(button => (
            <MenuItem key={button.id} selected={button.selected} onClick={button.onClickHandler(button.id, button.selected)}>
              {button.menuItemText}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper className={classes.headingContainer}>
        <Typography variant="h6">{this.props.label} </Typography>
        <div className={classes.facetHeaderButtons}>
          {(this.props.sortButton || this.props.spatialFilterButton) && this.renderFacetMenu()}
        </div>
      </Paper>
    );
  }
}

FacetHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  property: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  resultClass: PropTypes.string.isRequired,
  sortButton: PropTypes.bool.isRequired,
  spatialFilterButton: PropTypes.bool.isRequired,
  filterType: PropTypes.string.isRequired,
  distinctValueCount: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  fetchFacet: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetHeader);
