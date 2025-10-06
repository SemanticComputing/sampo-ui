import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import intl from 'react-intl-universal'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { styled } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Link } from 'react-router-dom'
import { has } from 'lodash'
import defaultImage from '../../img/main_page/thumb.png'

const GridItem = styled(Grid, {
  shouldForwardProp: prop => prop !== 'perspective'
})(({ theme, perspective }) => {
  const isCard = perspective.frontPageElement === 'card'

  return {
    textDecoration: 'none',
    height: 228,
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    },
    [theme.breakpoints.down('md')]: {
      height: 170,
      maxWidth: 300
    },
    ...(isCard && {
      height: 'inherit',
      maxWidth: 269,
      minWidth: 269
    })
  }
})

const PerspectiveCardPaper = styled(Paper, {
  shouldForwardProp: prop => prop !== 'perspective'
})(({ theme, perspective }) => {
  const imageUrl = perspective.frontPageImageUrl || ''
  return {
    padding: theme.spacing(1.5),
    boxSizing: 'border-box',
    color: '#fff',
    background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&:hover': {
      background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${imageUrl})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    height: '100%',
    width: '100%'
  }
})

const StyledCard = styled(Card)({
  width: '100%'
})

const StyledCardMedia = styled(CardMedia)({
  height: 100
})

const StyledCardContent = styled(CardContent)({
  height: 90
})

/**
 * A component for generating a Material-UI Card for a perspective on the portal's landing page.
 */
const MainCard = props => {
  const { perspective, cardHeadingVariant, rootUrl } = props
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  const externalPerspective = has(perspective, 'externalUrl')
  const isCard = perspective.frontPageElement === 'card'
  const searchMode = has(perspective, 'searchMode') ? perspective.searchMode : 'faceted-search'

  const linkProps = externalPerspective
    ? {
        component: 'a',
        href: perspective.externalUrl,
        target: '_blank'
      }
    : {
        component: Link,
        to: `${rootUrl}/${perspective.id}/${searchMode}`
      }

  return (
    <GridItem
      {...linkProps}
      key={perspective.id}
      item
      xs={12}
      sm={6}
      container={xsScreen}
      perspective={perspective}
    >
      {!isCard
        ? (
          <PerspectiveCardPaper perspective={perspective}>
            <Typography
              gutterBottom
              variant={cardHeadingVariant}
              component='h2'
              sx={{ color: '#fff' }}
            >
              {intl.get(`perspectives.${perspective.id}.label`)}
            </Typography>
            <Typography component='p' sx={{ color: '#fff' }}>
              {intl.get(`perspectives.${perspective.id}.shortDescription`)}
            </Typography>
          </PerspectiveCardPaper>
          )
        : (
          <StyledCard>
            <CardActionArea>
              <StyledCardMedia
                image={
                has(perspective, 'frontPageImageUrl')
                  ? perspective.frontPageImageUrl
                  : defaultImage
              }
                title={intl.get(`perspectives.${perspective.id}.label`)}
              />
              <StyledCardContent>
                <Typography gutterBottom variant='h5' component='h2'>
                  {intl.get(`perspectives.${perspective.id}.label`)}
                </Typography>
                <Typography component='p'>
                  {intl.get(`perspectives.${perspective.id}.shortDescription`)}
                </Typography>
              </StyledCardContent>
            </CardActionArea>
          </StyledCard>
          )}
    </GridItem>
  )
}

MainCard.propTypes = {
  perspective: PropTypes.object.isRequired,
  cardHeadingVariant: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default MainCard
