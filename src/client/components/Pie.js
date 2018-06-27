import React from 'react';
import PropTypes from 'prop-types';
import { VictoryPie, VictoryLegend, VictoryContainer } from 'victory';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
//import { dataArray, legendArray } from './TestData';


const styles = theme => ({
  root: {
    width: 600,
    height: '100%',
    display: 'flex',
    flexGrow: 1,
  },
  container: {
    height: '100%',
    alignItems: 'center'
  },
  pie: {
    paddingLeft: theme.spacing.unit * 4,
    paddingRight: theme.spacing.unit * 2,
  },
  legend: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 4,
  },
  legendPaper: {
    height: 300,
    overflowY: 'auto',
  }
});

let Pie = (props) => {
  const { classes, data } = props;
  const grouped = _.groupBy(data,'typeLabel');
  let dataArray = [];
  for (let key in grouped) {
    const length = grouped[key].length;
    //console.log(key)
    dataArray.push({
      x: key,
      y: length,
      values: grouped[key]
    });
  }
  dataArray = _.orderBy(dataArray, 'y', 'desc');
  const legendArray = dataArray.map(group => ({ name: group.x + ' (' + group.y + ')' }));
  const legendHeigth = legendArray.length * 34;

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid className={classes.pie} item xs={12} sm={6}>
          <VictoryPie
            padding={{
              left: 0, bottom: 0, top: 0
            }}
            colorScale={'qualitative'}
            data={dataArray}
            labels={() => null}
            animate={{
              duration: 4000
            }}
          />
        </Grid>
        <Grid className={classes.legend} item xs={12} sm={6}>
          <Paper className={classes.legendPaper}>
            <VictoryLegend
              height={legendHeigth}
              title={'Place type'}
              colorScale={'qualitative'}
              data={legendArray}
              style={{
                labels: { fontFamily: 'Roboto' },
                title: { fontFamily: 'Roboto' },
              }}
              containerComponent={
                <VictoryContainer
                  responsive={false}
                  width={242}
                />
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

Pie.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(Pie);
