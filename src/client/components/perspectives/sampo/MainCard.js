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
import makeStyles from '@mui/styles/makeStyles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Link } from 'react-router-dom'
import { has } from 'lodash'
import defaultImage from '../../../img/main_page/thumb.png'

const useStyles = makeStyles(theme => ({
  gridItem: props => ({
    textDecoration: 'none',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center'
    },
    height: 228,
    [theme.breakpoints.down('md')]: {
      height: 170,
      maxWidth: 300
    },
    [props.perspective.frontPageElement === 'card']: {
      height: 'inherit',
      maxWidth: 269,
      minWidth: 269
    }
  }),
  perspectiveCardPaper: props => ({
    padding: theme.spacing(1.5),
    boxSizing: 'border-box',
    color: '#fff',
    background: `linear-gradient( rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4) ), url(${props.perspective.frontPageImage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    '&:hover': {
      background: `linear-gradient( rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8) ), url(${props.perspective.frontPageImage})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    height: '100%',
    width: '100%'
  }),
  cardMedia: {
    height: 100
  },
  cardContent: {
    height: 90
  },
  card: {
    width: '100%'
  }
}))

/**
 * A component for generating a Material-UI Card for a perspective on the portal's landing page.
 */
const MainCard = props => {
  const classes = useStyles(props)
  const { perspective, cardHeadingVariant } = props
  const xsScreen = useMediaQuery(theme => theme.breakpoints.down('sm'))
  // const smScreen = useMediaQuery(theme => theme.breakpoints.between('sm', 'md'))
  const externalPerspective = has(perspective, 'externalUrl')
  const card = has(perspective, 'frontPageElement') && perspective.frontPageElement === 'card'
  const searchMode = has(perspective, 'searchMode') ? perspective.searchMode : 'faceted-search'

  return (
    <Grid
      className={classes.gridItem}
      key={perspective.id}
      item xs={12} sm={6} // optimized for four perspectives
      component={externalPerspective ? 'a' : Link}
      to={externalPerspective ? null : `${props.rootUrl}/${perspective.id}/${searchMode}`}
      container={xsScreen}
      href={externalPerspective ? perspective.externalUrl : null}
      target={externalPerspective ? '_blank' : null}
    >
      {!card &&
        <Paper className={classes.perspectiveCardPaper}>
          <Typography
            gutterBottom
            variant={cardHeadingVariant}
            component='h2'
            sx={{ color: '#fff' }}
          >
            {intl.get(`perspectives.${perspective.id}.label`)}
          </Typography>
          <Typography
            component='p'
            sx={{ color: '#fff' }}
          >
            {intl.get(`perspectives.${perspective.id}.shortDescription`)}
          </Typography>
        </Paper>}
      {card &&
        <Card className={classes.card}>
          <CardActionArea>
            <CardMedia
              className={classes.cardMedia}
              image={has(perspective, 'frontPageImage')
                ? perspective.frontPageImage
                : defaultImage}
              title={intl.get(`perspectives.${perspective.id}.label`)}
            />
            <CardContent className={classes.cardContent}>
              <Typography gutterBottom variant='h5' component='h2'>
                {intl.get(`perspectives.${perspective.id}.label`)}
              </Typography>
              <Typography component='p'>
                {intl.get(`perspectives.${perspective.id}.shortDescription`)}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>}
    </Grid>
  )
}

MainCard.propTypes = {
  perspective: PropTypes.object.isRequired,
  cardHeadingVariant: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export default MainCard
