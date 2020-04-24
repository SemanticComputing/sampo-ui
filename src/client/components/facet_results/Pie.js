import React from 'react'
import PropTypes from 'prop-types'
import {
  VictoryPie,
  VictoryLegend,
  VictoryContainer
  // VictoryLabel,
} from 'victory'
import PieTooltip from './PieTooltip'
import _ from 'lodash'
import { withStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import ResultInfo from './ResultInfo'

const styles = theme => ({
  root: {
    height: '100%',
    display: 'flex',
    flexGrow: 1

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
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(2)
  },
  legend: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(4)
  },
  legendPaper: {
    height: 275,
    overflowY: 'auto'
  }
})

const combineSmallGroups = (dataArray) => {
  const totalLength = dataArray.length
  const threshold = 0.1
  const other = { x: 'Other', y: 0, values: [] }
  const newArray = []
  for (const item of dataArray) {
    const portion = item.y / totalLength
    if (portion < threshold) {
      other.y += item.y
      other.values.push(item.values)
    } else {
      newArray.push(item)
    }
  }
  if (other.y > 0) {
    newArray.push(other)
    return newArray
  } else {
    return dataArray
  }
}

const Pie = (props) => {
  const { classes, data, groupBy } = props
  const resultCount = data.length
  if (resultCount < 10) {
    return <ResultInfo message='Need over 10 results to create a distribution.' />
  }
  const grouped = _.groupBy(data, groupBy)
  let dataArray = []
  for (const key in grouped) {
    const length = grouped[key].length
    dataArray.push({
      x: key,
      y: length,
      values: grouped[key]
    })
  }
  dataArray = _.orderBy(dataArray, 'y', 'desc')
  dataArray = combineSmallGroups(dataArray)
  const legendArray = dataArray.map(group => ({ name: group.x.toLowerCase() + ' (' + group.y + ')' }))
  const legendHeigth = legendArray.length * 35
  // const pieTitle = resultCount + ' results for the query "' + query + '"';
  // <VictoryLabel
  //   style={{
  //     fontSize: '14px',
  //     fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  //   }}
  //   text={pieTitle}
  // />

  return (
    <div className={classes.root}>
      <Grid container className={classes.container}>
        <Grid className={classes.pie} item xs={12} sm={6}>

          <VictoryPie
            padding={{
              left: 0, bottom: 0, top: 32
            }}
            colorScale='qualitative'
            data={dataArray}
            labelComponent={<PieTooltip resultCount={resultCount} />}
          />
        </Grid>
        <Grid className={classes.legend} item xs={12} sm={6}>
          <Paper className={classes.legendPaper}>
            <VictoryLegend
              height={legendHeigth}
              title={props.groupByLabel}
              colorScale='qualitative'
              data={legendArray}
              style={{
                labels: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' },
                title: { fontFamily: 'Roboto, Helvetica, Arial, sans-serif' }
              }}
              containerComponent={
                <VictoryContainer
                  responsive={false}
                  width={275}
                />
              }
            />
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

Pie.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  groupBy: PropTypes.string.isRequired,
  groupByLabel: PropTypes.string.isRequired,
  query: PropTypes.string.isRequired
}

export default withStyles(styles)(Pie)
