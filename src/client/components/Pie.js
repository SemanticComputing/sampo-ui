import React from 'react';
import PropTypes from 'prop-types';
import {
  VictoryPie,
  VictoryLegend,
  VictoryContainer,
  VictoryLabel,
} from 'victory';
import PieTooltip from './PieTooltip';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

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
    height: 275,
    overflowY: 'auto',
  }
});

const combineSmallGroups = (dataArray) => {
  const totalLength = dataArray.length;
  const threshold = 0.1;
  let other = { x: 'Other', y: 0, values: [] };
  let newArray = [];
  for (let item of dataArray) {
    const portion = item.y / totalLength;
    if (portion < threshold) {
      other.y += item.y;
      other.values.push(item.values);
    } else {
      newArray.push(item);
    }
  }
  if (other.y > 0) {
    newArray.push(other);
    return newArray;
  } else {
    return dataArray;
  }
};

let Pie = (props) => {
  const { classes, data, query, groupBy } = props;
  const resultCount = data.length;
  if (resultCount < 1) {
    return '';
  }
  const grouped = _.groupBy(data, groupBy);
  let dataArray = [];
  for (let key in grouped) {
    const length = grouped[key].length;
    dataArray.push({
      x: key,
      y: length,
      values: grouped[key]
    });
  }
  dataArray = _.orderBy(dataArray, 'y', 'desc');
  dataArray = combineSmallGroups(dataArray);
  const legendArray = dataArray.map(group => ({ name: group.x + ' (' + group.y + ')' }));
  const legendHeigth = legendArray.length * 34;
  const pieTitle = resultCount + ' results for the query "' + query + '"';

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>

        <Grid className={classes.pie} item xs={12} sm={6}>
          <VictoryLabel
            style={{
              fontSize: '14px',
              fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            }}
            text={pieTitle}
          />
          <VictoryPie
            padding={{
              left: 0, bottom: 0, top: 32
            }}
            colorScale={'qualitative'}
            data={dataArray}
            labelComponent={<PieTooltip resultCount={resultCount} />}
          />
        </Grid>
        <Grid className={classes.legend} item xs={12} sm={6}>
          <Paper className={classes.legendPaper}>
            <VictoryLegend
              height={legendHeigth}
              title={groupBy}
              colorScale={'qualitative'}
              data={legendArray}
              style={{
                labels: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
                title: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
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
  data: PropTypes.array.isRequired,
  groupBy: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired,
};

export default withStyles(styles)(Pie);
