import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ApexCharts from 'apexcharts';
import { isEqual } from 'lodash';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    width: 'calc(100% - 16px)',
    height: 'auto',
    padding: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 152px)',
      width: 'calc(100% - 80px)',
      padding: theme.spacing(5),
    },
    display: 'flex',
    alignItems: 'center',
  },
  chart: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      height: 400
    },
    //border: '1px solid rgba(224, 224, 224, 1);',
  }

});

class ApexChart extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
  }

  componentDidMount() {
    this.chart = new ApexCharts(
      this.chartRef.current,
      this.props.options,
    );
    this.chart.render();
  }

  componentDidUpdate(prevProps) {
    // Rerender chart when the props changes
    if (!isEqual(this.props.options, prevProps.options)) {
      this.rerenderChart();
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    const { classes } = this.props;
    return (
      <Paper square className={classes.root}>
        <div className={classes.chart} ref={this.chartRef} />
      </Paper>
    );
  }

  /**
   * Helper method for rerendering a chart
   */
  rerenderChart = () => {
    // Destroy the previous chart
    this.chart.destroy();
    // Create a new chart
    this.chart = new ApexCharts(
      this.chartRef.current,
      this.props.options,
    );
    // Render it
    this.chart.render();
  }
}

ApexChart.propTypes = {
  classes: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired
};

export default withStyles(styles)(ApexChart);
