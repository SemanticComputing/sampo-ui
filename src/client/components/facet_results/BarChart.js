import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chart from 'react-apexcharts';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
  root: {
    overflow: 'auto',
    width: '100%',
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      height: 'calc(100% - 72px)'
    },
    backgroundColor: theme.palette.background.paper,
    borderTop: '1px solid rgba(224, 224, 224, 1);',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'

  },
});

class BarChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'apexchart-example',
          // zoom: {
          //   enabled: true,
          //   type: 'x',
          //   autoScaleYaxis: false,
          //   zoomedArea: {
          //     fill: {
          //       color: '#90CAF9',
          //       opacity: 0.4
          //     },
          //     stroke: {
          //       color: '#0D47A1',
          //       opacity: 0.4,
          //       width: 1
          //     }
          //   }
          // }
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }]
    };
  }

  componentDidMount = () => {
    // this.props.fetchResults({
    //   resultClass: this.props.resultClass,
    //   facetClass: this.props.facetClass,
    // });
  }

  render() {
    //console.log(this.props.data);
    return(
      <Paper className={this.props.classes.root}>
        <Chart
          options={this.state.options}
          series={this.state.series}
          type='bar'
          width={500}
          height={320}
        />
      </Paper>
    );
  }

}

BarChart.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  fetchResults: PropTypes.func.isRequired
};

export default withStyles(styles)(BarChart);
