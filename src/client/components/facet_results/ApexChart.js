import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ApexCharts from 'apexcharts';
import Paper from '@material-ui/core/Paper';
import purple from '@material-ui/core/colors/purple';
import CircularProgress from '@material-ui/core/CircularProgress';
import { has } from 'lodash';

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
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
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
    this.props.fetchResults({
      resultClass: this.props.resultClass,
      facetClass: this.props.facetClass
    });
  }

  componentDidUpdate(prevProps) {
    // Render the chart when data changes
    if (prevProps.data != this.props.data) {
      console.log(this.props.data)
        
      //let categories = this.props.data.reduce((obj, item) => (obj[item.id] = item.type, obj) ,{});
      // for (let [key, value] of Object.entries(categories)) {
      //   value.map(obj => {
      //     if (!has(series, obj.id)) {
      //       series[obj.id] = {
      //         name: obj.prefLabel,
      //         data: [  ]
      //       }
      //     }
      //   })
      // }
      const options = {
        ...this.props.options,
        series: [
          {
            name: 'PRODUCT A',
            data: [44, 55, 41, 67, 22, 43, 21, 49]
          },
          {
            name: 'PRODUCT B',
            data: [13, 23, 20, 8, 13, 27, 33, 12]
          },
          {
            name: 'PRODUCT C',
            data: [11, 17, 15, 15, 21, 14, 15, 13]
          }
        ],
        xaxis: {
          categories: ['2011 Q1', '2011 Q2', '2011 Q3', '2011 Q4', '2012 Q1', '2012 Q2', '2012 Q3', '2012 Q4'],
        },
      };
      // Destroy the previous chart
      if (this.chart) {
        this.chart.destroy();
      }
      this.chart = new ApexCharts(
        this.chartRef.current,
        options,
      );
      this.chart.render();
    }
  }

  componentWillUnmount() {
    this.chart.destroy();
  }

  render() {
    const { classes, fetching } = this.props;
    return (
      <Paper square className={classes.root}>
        {fetching &&
          <div className={this.props.classes.spinnerContainer}>
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
          </div>
        }
        {!fetching &&
          <div className={classes.chart} ref={this.chartRef} />
        }
      </Paper>
    );
  }
}

ApexChart.propTypes = {
  classes: PropTypes.object.isRequired,
  fetching: PropTypes.bool.isRequired,
  data: PropTypes.array,
  options: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired
};

export default withStyles(styles)(ApexChart);
