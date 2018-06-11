import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/lab/Slider';

const styles = {
  container: {
    width: 150,
  },
};

class SimpleSlider extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: props.sliderValue
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.setOpacity(value);
  }

  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div className={classes.container}>
        <Slider value={value} aria-labelledby="label" onChange={this.handleChange} />
      </div>
    );
  }
}

SimpleSlider.propTypes = {
  classes: PropTypes.object.isRequired,
  sliderValue: PropTypes.number.isRequired,
  setOpacity: PropTypes.func.isRequired,
};

export default withStyles(styles)(SimpleSlider);
