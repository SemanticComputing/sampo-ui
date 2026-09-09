import React, { useEffect } from 'react'
import { List, AutoSizer } from 'react-virtualized'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import intl from 'react-intl-universal'
import { Link } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'

const Root = styled('div', {
  shouldForwardProp: prop => prop !== 'layoutConfig'
})(({ theme, layoutConfig }) => {
  const baseHeight = window.innerHeight -
    layoutConfig.topBar.reducedHeight -
    layoutConfig.tabHeight

  let height = baseHeight - 139
  if (window.innerWidth >= 600) height = baseHeight - 256
  if (window.innerWidth >= layoutConfig.hundredPercentHeightBreakPoint) height = baseHeight - 178
  if (window.innerWidth >= 1100) height = baseHeight - 196
  if (window.innerWidth >= layoutConfig.reducedHeightBreakpoint) height = baseHeight - 265

  return {
    marginTop: theme.spacing(1),
    maxWidth: 350,
    height,
    fontFamily: 'Roboto'
  }
})

const StyledList = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    paddingRight: 4
  }
}))

const StyledLink = styled(Link)({
  textDecoration: 'none'
})

const ProgressContainer = styled('div')(({ theme }) => ({
  width: '100%',
  height: 600,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  [theme.breakpoints.up('md')]: {
    height: 'calc(100% - 80px)'
  }
}))

const ReactVirtualizedList = props => {
  const { results } = props.perspectiveState

  useEffect(() => {
    props.fetchResults({ resultClass: props.resultClass, facetClass: props.facetClass })
  }, [])

  useEffect(() => {
    if (props.facetUpdateID > 0) {
      props.fetchResults({ resultClass: props.resultClass, facetClass: props.facetClass })
    }
  }, [props.facetUpdateID])

  const rowRenderer = ({ key, index, style }) => {
    const data = results[index]
    const image = data.imageURL?.split(', ')[0] || null

    return (
      <div key={key} style={style}>
        <StyledLink to={data.dataProviderUrl}>
          <Card>
            <CardActionArea>
              {image && (
                <CardMedia
                  component='img'
                  alt='Kuva löydöstä'
                  height='140'
                  image={image}
                  title='Kuva löydöstä'
                />
              )}
              <CardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  {data.findName}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>{intl.get('perspectives.finds.properties.objectType.label')}: </strong>
                  {data.objectType}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>{intl.get('perspectives.finds.properties.material.label')}: </strong>
                  {data.material}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>{intl.get('perspectives.finds.properties.period.label')}: </strong>
                  {data.period}
                </Typography>
                <Typography variant='body2' color='textSecondary'>
                  <strong>{intl.get('perspectives.finds.properties.municipality.label')}: </strong>
                  {data.municipality}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </StyledLink>
      </div>
    )
  }

  const getRowHeight = ({ index }) => {
    const data = results[index]
    let height = 300
    if (!data.imageURL) {
      height -= 140
    }
    if (data.findName.length > 26) {
      height += 32
    }
    if (data.findName.length > 40) {
      height += 54
    }
    if (data.period) {
      const limit = window.innerWidth < 328 ? 25 : 34
      if (data.period.length > limit) {
        height += 20
      }
    }
    return height
  }

  const validResults = () => {
    const { results, resultClass } = props.perspectiveState
    return resultClass === props.resultClass && results && results.length > 0
  }

  return (
    <Root layoutConfig={props.layoutConfig}>
      {(!validResults() || props.perspectiveState.results.fetching)
        ? (
          <ProgressContainer>
            <CircularProgress />
          </ProgressContainer>
          )
        : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                className={StyledList}
                height={height}
                width={width}
                rowCount={results.length}
                rowHeight={getRowHeight}
                rowRenderer={rowRenderer}
              />
            )}
          </AutoSizer>
          )}
    </Root>
  )
}

export default ReactVirtualizedList
