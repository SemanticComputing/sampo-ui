import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
    justifyContent: 'space-between',
    width: '100%'
    //paddingLeft: theme.spacing(1),
    //borderBottomLeftRadius: 0,
    //borderBottomRightRadius: 0,
    //height: 48
  },
  facetValuesContainerTen: {
    height: 345,
    padding: theme.spacing(1),
  },
  facetValuesContainerThree: {
    height: 108,
    padding: theme.spacing(1),
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

  handleSortOnClick = buttonID => () =>  {
    this.setState({ anchorEl: null });
    if (buttonID === 'prefLabel' && this.props.facet.sortBy === 'instanceCount') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'sortBy',
        value: 'prefLabel'
      });
    }
    if (buttonID === 'instanceCount' && this.props.facet.sortBy === 'prefLabel') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'sortDirection',
        value: 'desc'
      });
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'sortBy',
        value: 'instanceCount'
      });
    }
  };

  handleFilterTypeOnClick = buttonID => () => {
    //console.log(event.target)
    this.setState({ anchorEl: null });

    if (buttonID === 'uriFilter' && this.props.facet.filterType === 'spatialFilter') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'spatialFilter',
        value: null
      });
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'filterType',
        value: 'uriFilter'
      });
    }
    if (buttonID === 'spatialFilter' && this.props.facet.filterType === 'uriFilter') {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: this.props.facetID,
        option: 'filterType',
        value: 'spatialFilter'
      });
      if (this.props.facetID === 'productionPlace') {
        history.push({ pathname: `/manuscripts/production_places`});
      }
    }
  }

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  renderFacetMenu = () => {
    const { anchorEl } = this.state;
    const { sortButton, spatialFilterButton, sortBy, filterType } = this.props.facet;
    const open = Boolean(anchorEl);
    let menuButtons = [];
    if (sortButton) {
      menuButtons.push({
        id: 'prefLabel',
        menuItemText: 'Sort alphabetically',
        selected: sortBy === 'prefLabel' ? true : false,
        onClickHandler: this.handleSortOnClick
      });
      menuButtons.push({
        id: 'instanceCount',
        menuItemText: `Sort by number of ${this.props.resultClass}`,
        selected: sortBy === 'instanceCount' ? true : false,
        onClickHandler: this.handleSortOnClick
      });
    }
    if (spatialFilterButton) {
      menuButtons.push({
        id: 'uriFilter',
        menuItemText: `Filter by name`,
        selected: filterType === 'uriFilter' ? true : false,
        onClickHandler: this.handleFilterTypeOnClick
      });
      menuButtons.push({
        id: 'spatialFilter',
        menuItemText: `Filter by bounding box`,
        selected: filterType === 'spatialFilter' ? true : false,
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
            <MenuItem key={button.id} selected={button.selected} onClick={button.onClickHandler(button.id)}>
              {button.menuItemText}
            </MenuItem>
          ))}
        </Menu>
      </React.Fragment>
    );
  }

  render() {
    const { classes, isActive } = this.props;
    const { label, sortButton, spatialFilterButton } = this.props.facet;
    let showMenuButton = isActive && (sortButton || spatialFilterButton);
    return (
      <div className={classes.headingContainer}>
        <Typography variant="body1">{label} </Typography>
        {showMenuButton &&
          <div className={classes.facetHeaderButtons}>
            {this.renderFacetMenu()}
          </div>
        }
      </div>
    );
  }
}

FacetHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  facetID: PropTypes.string,
  facet: PropTypes.object,
  isActive: PropTypes.bool.isRequired,
  facetClass: PropTypes.string,
  resultClass: PropTypes.string,
  fetchFacet: PropTypes.func,
  updateFacetOption: PropTypes.func,
};

export default withStyles(styles)(FacetHeader);
