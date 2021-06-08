import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import intl from 'react-intl-universal'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5)
  },
  panel: {
    width: '100%'
  },
  summary: props => ({
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down(props.layoutConfig.reducedHeightBreakpoint)]: {
      minHeight: `${props.layoutConfig.infoHeader.reducedHeight.height}px !important`
    },
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      minHeight: `${props.layoutConfig.infoHeader.default.height}px !important`
    }
  }),
  summaryContent: {
    display: 'block',
    marginTop: theme.spacing(0.5),
    marginBottom: `${theme.spacing(0.5)}px !important`
  },
  headingContainer: {
    display: 'flex'
  },
  heading: {
    flexShrink: 1
  },
  infoIconButton: {
    padding: 0,
    marginLeft: theme.spacing(0.5)
  },
  infoIcon: props => ({
    [theme.breakpoints.down(props.layoutConfig.reducedHeightBreakpoint)]: {
      fontSize: props.layoutConfig.infoHeader.reducedHeight.infoIconFontSize
    },
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      fontSize: props.layoutConfig.infoHeader.default.infoIconFontSize
    }
  }),
  label: {
    marginTop: theme.spacing(1),
    height: 32,
    overflow: 'auto'
  },
  expandedContent: props => ({
    '& p, & ul': {
      fontSize: '0.875rem'
    },
    height: props.layoutConfig.infoHeader.reducedHeight.expandedContentHeight,
    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
      height: props.layoutConfig.infoHeader.default.expandedContentHeight,
      '& p, & ul': {
        fontSize: '1rem'
      }
    },
    paddingTop: 0,
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflow: 'auto',
    display: 'block'
  })
}))

/**
 * A component for instructions for a faceted search perspective or an entity landing page.
 */
const InfoHeader = props => {
  const handleExpandButtonOnClick = () => {
    props.updateExpanded({
      resultClass: props.resultClass,
      pageType: props.pageType
    })
  }

  const generateLabel = () => {
    let label = ''
    const data = props.instanceData
    const hasData = data !== null && Object.values(data).length >= 1
    if (hasData && data.prefLabel) { label = data.prefLabel.prefLabel || data.prefLabel }
    return label
  }

  const getHeadingVariant = () => {
    const { screenSize } = props
    let variant = props.layoutConfig.infoHeader.default.headingVariant
    if (screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md') {
      variant = props.layoutConfig.infoHeader.reducedHeight.headingVariant
    }
    return variant
  }

  const classes = useStyles(props)

  return (
    <div className={classes.root}>
      <Accordion
        className={classes.panel}
        expanded={props.expanded}
      >
        <AccordionSummary
          className={classes.summary}
          classes={{
            content: classes.summaryContent
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          IconButtonProps={{ onClick: handleExpandButtonOnClick }}
        >
          <div className={classes.headingContainer}>
            <Typography component='h1' variant={getHeadingVariant()} className={classes.heading}>
              {props.pageType === 'facetResults' && intl.get(`perspectives.${props.resultClass}.label`)}
              {props.pageType === 'instancePage' && intl.get(`perspectives.${props.resultClass}.instancePage.label`)}
            </Typography>
            <IconButton className={classes.infoIconButton} onClick={handleExpandButtonOnClick}>
              <InfoIcon className={classes.infoIcon} />
            </IconButton>
          </div>
          {props.pageType === 'instancePage' &&
            <Typography className={classes.label} component='h1' variant='h6'>{generateLabel()}</Typography>}
        </AccordionSummary>
        <AccordionDetails className={classes.expandedContent}>
          {props.pageType === 'facetResults' && intl.getHTML(`perspectives.${props.resultClass}.longDescription`)}
          {props.pageType === 'instancePage' &&
            <>
              {intl.getHTML('instancePageGeneral.introduction',
                { entity: intl.get(`perspectives.${props.resultClass}.instancePage.label`) })}
              {intl.getHTML(`perspectives.${props.resultClass}.instancePage.description`)}
              {intl.getHTML('instancePageGeneral.repetition')}
            </>}
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

InfoHeader.propTypes = {
  resultClass: PropTypes.string.isRequired,
  instanceData: PropTypes.object,
  pageType: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  updateExpanded: PropTypes.func.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default InfoHeader
