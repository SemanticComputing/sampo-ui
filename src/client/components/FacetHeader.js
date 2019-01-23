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

  handleSortByClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuItemClick = (sortBy, isSelected) => () =>  {
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
    this.props.fetchFacet(this.props.property, sortBy, sortDirection);
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
  }

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    const options = [
      {
        id: 'prefLabel',
        menuItemText: 'Sort alphabetically',
        selected: this.props.sortBy === 'prefLabel' ? true : false,
        sortDirection: this.props.sortDirection,
      },
      {
        id: 'instanceCount',
        menuItemText: 'Sort by manuscript count',
        selected: this.props.sortBy === 'instanceCount' ? true : false,
        sortDirection: this.props.sortDirection,
      },
    ];

    return (
      <Paper className={classes.headingContainer}>
        <Typography variant="h6">{this.props.label} {this.props.distinctValueCount > 0 ? `(${this.props.distinctValueCount})` : ''}</Typography>
        <div className={classes.facetHeaderButtons}>
          {/*<IconButton disabled aria-label="Statistics">
            <PieChart />
          </IconButton> */}
          {!this.props.hierarchical &&
            <React.Fragment>
              <IconButton
                aria-label="More"
                aria-owns={open ? 'facet-menu' : undefined}
                aria-haspopup="true"
                onClick={this.handleSortByClick}
              >
                <SortByAlphaIcon />
              </IconButton>
              <Menu
                id="facet-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleMenuClose}
              >
                {options.map(option => (
                  <MenuItem key={option.id} selected={option.selected} onClick={this.handleMenuItemClick(option.id, option.selected)}>
                    {option.menuItemText}
                  </MenuItem>
                ))}
              </Menu>
            </React.Fragment>
          }
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
  property: PropTypes.string.isRequired,
  hierarchical: PropTypes.bool.isRequired,
  distinctValueCount: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  fetchFacet: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetHeader);
