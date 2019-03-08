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
    height: '100%',
    display: 'flex',
    flexGrow: 1,
  },
  container: {
    marginLeft: 'auto',
    marginRight: 'auto',
    width: 'calc(100% - 50px)',
    maxWidth: 900,
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
  let other = { x: 'Other', y: 0 };
  let newArray = [];
  for (let item of dataArray) {
    const portion = item.y / totalLength;
    if (portion < threshold) {
      other.y += item.y;
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

class Pie extends React.Component {

  componentDidMount = () => {
    this.props.fetchPlaces('productionPlaces');
  }

  render() {
    const { classes, data } = this.props;
    const resultCount = data.length;
    if (resultCount < 1) {
      return '';
    }
    // const grouped = _.groupBy(data, groupBy);
    // let dataArray = [];
    // for (let key in grouped) {
    //   const length = grouped[key].length;
    //   dataArray.push({
    //     x: key,
    //     y: length,
    //     values: grouped[key]
    //   });
    // }
    let placeLinks = 0;
    let dataArray = data.map(item => {
      const msCount = parseInt(item.manuscriptCount);
      placeLinks += msCount;
      return {
        x: item.prefLabel,
        y: msCount,
      };
    });
    dataArray = _.orderBy(dataArray, 'y', 'desc');
    dataArray = combineSmallGroups(dataArray, placeLinks);

    const legendArray = dataArray.map(group => ({ name: group.x + ' (' + group.y + ')' }));
    const legendHeigth = legendArray.length * 33;

    const pieTitle = placeLinks + ' production place links in total';

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
              labelComponent={<PieTooltip resultCount={placeLinks} />}
            />
          </Grid>
          <Grid className={classes.legend} item xs={12} sm={6}>
            <Paper className={classes.legendPaper}>
              <VictoryLegend
                height={legendHeigth}
                title={'Production place (manuscript count)'}
                colorScale={'qualitative'}
                data={legendArray}
                style={{
                  labels: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
                  title: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
                }}
                containerComponent={
                  <VictoryContainer
                    responsive={false}
                    width={250}
                  />
                }
              />
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

Pie.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  fetchPlaces: PropTypes.func.isRequired
};

export default withStyles(styles)(Pie);
