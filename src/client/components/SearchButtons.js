import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import {CSVLink} from 'react-csv';

class SearchButtons extends React.Component {
  state = {
    anchorEl: null,
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleClickSearchButton = () => {
    console.log('places');
  };

  handleMouseDownButton = (event) => {
    event.preventDefault();
  };

  render() {
    const { anchorEl } = this.state;

    return (
      <InputAdornment position="end">
        <IconButton
          aria-label="Search places"
          onClick={this.handleClickSearchButton}
          onMouseDown={this.handleMouseDownButton}
        >
          <SearchIcon />
        </IconButton>
        <IconButton
          aria-label="More"
          aria-owns={anchorEl ? 'long-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="long-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          <MenuItem
            key='csv'
            onClick={this.handleClose}>
            <CSVLink data={this.props.search.results}>Results as CSV</CSVLink>
          </MenuItem>
          <MenuItem
            key='opt2'
            onClick={this.handleClose}>
            Option 2
          </MenuItem>
          <MenuItem
            key='otp3'
            onClick={this.handleClose}>
            Option 3
          </MenuItem>
        </Menu>
      </InputAdornment>
    );
  }
}

SearchButtons.propTypes = {
  search: PropTypes.object.isRequired,
};

export default SearchButtons;
