import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import InstancePageTable from './InstancePageTable'
import Player from './Player'
import VideoTableOfContents from './VideoTableOfContents'
import { has } from 'lodash'

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
    backgroundColor: '#bdbdbd'
  },
  mainContainer: props => ({
    margin: 0,
    maxWidth: 1100,
    // minHeight: 1100,
    marginTop: theme.spacing(1),
    // flexWrap: 'wrap-reverse',
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${theme.spacing(2.5)}px)`
    }
  }),
  gridItem: props => ({
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '100%'
    },
    paddingTop: '0px !important',
    paddingBottom: '0px !important'
  }),
  tableOfContents: props => ({
    padding: theme.spacing(2),
    overflow: 'auto',
    top: theme.spacing(0.5),
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: 'calc(100% - 32px)'
    }
  }),
  videoPlayerContainer: props => ({
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '60%'
    },
    [theme.breakpoints.down('sm')]: {
      maxWidth: 500
    },
    overflow: 'auto',
    marginBottom: theme.spacing(1),
    display: 'flex',
    alignItems: 'center'
  }),
  tableContainer: props => ({
    marginBottom: theme.spacing(1),
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(40% - ${theme.spacing(1)}px)`,
      overflow: 'auto'
    }
  }),
  wordCloud: props => ({
    marginTop: theme.spacing(1),
    padding: theme.spacing(2),
    overflow: 'auto',
    height: 200,
    display: 'none',
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: '40%',
      display: 'block'
    }
  }),
  wordCloudContainer: {
    width: '100%'
  },
  tooltip: {
    maxWidth: 500
  },
  tooltipContent: {
    padding: theme.spacing(1)
  },
  tooltipList: {
    listStylePosition: 'inside',
    paddingLeft: 0
  }
}))

const VideoPage = props => {
  const classes = useStyles(props)
  const { instanceTableData } = props.perspectiveState
  const { portalConfig, perspectiveConfig, localID, resultClass, screenSize, layoutConfig } = props
  let { properties } = props

  const readyToRenderVideoPlayer = () => {
    return `http://ldf.fi/warmemoirsampo/${localID}` === instanceTableData.id &&
        has(instanceTableData, 'youTubeID')
  }

  if (!has(instanceTableData, 'warsaPage')) {
    properties = properties.filter(prop => prop.id !== 'warsaPage')
  }

  return (
    <div className={classes.root}>
      <Grid className={classes.mainContainer} container spacing={1}>
        <Grid className={classes.gridItem} item xs={12} sm={12} md={7}>
          <Paper className={classes.videoPlayerContainer}>
            {readyToRenderVideoPlayer() &&
              <Player
                resultClass={props.resultClass}
                data={instanceTableData}
                routeProps={props.routeProps}
                videoPlayerState={props.videoPlayerState}
                updateVideoPlayerTime={props.updateVideoPlayerTime}
              />}
          </Paper>
          <Paper className={classes.tableContainer}>
            <InstancePageTable
              portalConfig={portalConfig}
              perspectiveConfig={perspectiveConfig}
              resultClass={resultClass}
              data={instanceTableData}
              properties={properties}
              screenSize={screenSize}
              layoutConfig={layoutConfig}
            />
          </Paper>
        </Grid>
        <Grid className={classes.gridItem} item xs={12} sm={12} md={5}>
          <Paper className={classes.tableOfContents}>
            <Typography variant='h6' component='h2'>Sisällysluettelo</Typography>
            {has(instanceTableData, 'timeSlice') &&
              <VideoTableOfContents
                instanceTableData={instanceTableData}
                toc={instanceTableData.timeSlice}
                textFormat='plain-text-from-text-slice'
                // textFormat='annotated-html-from-text-slice'
                // textFormat='annotated-html-from-time-slice'
                videoPlayerState={props.videoPlayerState}
              />}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default VideoPage
