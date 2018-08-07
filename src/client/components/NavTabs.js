import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

class NavTabs extends React.Component {
  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { value } = this.state;
    return (
      <Tabs value={value} onChange={this.handleChange}>
        <Tab label="Table" />
        <Tab label="Map" />
        <Tab label="Statistics" />
      </Tabs>
    );
  }
}

NavTabs.propTypes = {
  resultView: PropTypes.string,
};

export default NavTabs;
