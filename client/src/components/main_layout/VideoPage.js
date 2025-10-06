import React from 'react'
import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'
import InstancePageTable from './InstancePageTable'
import Player from './Player'
import VideoTableOfContents from './VideoTableOfContents'
import { has } from 'lodash'
import { useLocation } from 'react-router-dom'

// Forward only layoutConfig prop for custom calculations
const Root = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
  backgroundColor: '#bdbdbd'
})

const MainContainer = styled(Grid, {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => ({
  margin: 0,
  maxWidth: 1100,
  marginTop: theme.spacing(1),
  [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
    height: `calc(100% - ${theme.spacing(2.5)})`
  }
}))

const GridItem = styled(Grid, {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => ({
  [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
    height: '100%'
  },
  paddingTop: '0px !important',
  paddingBottom: '0px !important'
}))

const VideoPlayerContainer = styled(Paper, {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => ({
  overflow: 'auto',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
    height: '60%'
  },
  [theme.breakpoints.down('md')]: {
    maxWidth: 500
  }
}))

const TableContainer = styled(Paper, {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => ({
  marginBottom: theme.spacing(1),
  [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
    height: `calc(40% - ${theme.spacing(1)})`,
    overflow: 'auto'
  }
}))

const TableOfContents = styled(Paper, {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => ({
  padding: theme.spacing(2),
  overflow: 'auto',
  top: theme.spacing(0.5),
  [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
    height: 'calc(100% - 32px)'
  }
}))
styled(Paper, {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => ({
  marginTop: theme.spacing(1),
  padding: theme.spacing(2),
  overflow: 'auto',
  height: 200,
  display: 'none',
  [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
    height: '40%',
    display: 'block'
  }
}))
styled('div')({
  width: '100%'
})
styled('div')({
  maxWidth: 500
})
styled('div')(({ theme }) => ({
  padding: theme.spacing(1)
}))
styled('ul')({
  listStylePosition: 'inside',
  paddingLeft: 0
})
const VideoPage = props => {
  const {
    perspectiveState: { instanceTableData },
    portalConfig,
    perspectiveConfig,
    localID,
    resultClass,
    screenSize,
    layoutConfig,
    videoPlayerState,
    updateVideoPlayerTime
  } = props

  let { properties } = props

  const location = useLocation()

  const readyToRenderVideoPlayer = () =>
    `http://ldf.fi/warmemoirsampo/${localID}` === instanceTableData.id &&
    has(instanceTableData, 'youTubeID')

  if (!has(instanceTableData, 'warsaPage')) {
    properties = properties.filter(prop => prop.id !== 'warsaPage')
  }

  return (
    <Root>
      <MainContainer container spacing={1} layoutConfig={layoutConfig}>
        <GridItem item xs={12} sm={12} md={7} layoutConfig={layoutConfig}>
          <VideoPlayerContainer layoutConfig={layoutConfig}>
            {readyToRenderVideoPlayer() && (
              <Player
                resultClass={resultClass}
                data={instanceTableData}
                location={location}
                videoPlayerState={videoPlayerState}
                updateVideoPlayerTime={updateVideoPlayerTime}
              />
            )}
          </VideoPlayerContainer>
          <TableContainer layoutConfig={layoutConfig}>
            <InstancePageTable
              portalConfig={portalConfig}
              perspectiveConfig={perspectiveConfig}
              resultClass={resultClass}
              data={instanceTableData}
              properties={properties}
              screenSize={screenSize}
              layoutConfig={layoutConfig}
            />
          </TableContainer>
        </GridItem>
        <GridItem item xs={12} sm={12} md={5} layoutConfig={layoutConfig}>
          <TableOfContents layoutConfig={layoutConfig}>
            <Typography variant='h6' component='h2'>Sisällysluettelo</Typography>
            {has(instanceTableData, 'timeSlice') && (
              <VideoTableOfContents
                instanceTableData={instanceTableData}
                toc={instanceTableData.timeSlice}
                textFormat='plain-text-from-text-slice'
                videoPlayerState={videoPlayerState}
              />
            )}
          </TableOfContents>
        </GridItem>
      </MainContainer>
    </Root>
  )
}

export default VideoPage
