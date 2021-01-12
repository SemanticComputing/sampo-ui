import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
// import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/InfoOutlined'
import intl from 'react-intl-universal'

const styles = theme => ({
  root: {
    position: 'absolute',
    // marginTop: 64,
    paddingTop: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    paddingRight: theme.spacing(1.5),
    [theme.breakpoints.down('sm')]: {
      marginTop: 56
    },
    [theme.breakpoints.up('sm')]: {
      marginTop: 64
    }
  },
  panel: {
    width: '100%'
  },
  summary: {
    paddingLeft: theme.spacing(1)
  },
  summaryContent: {
    display: 'block',
    marginBottom: `${theme.spacing(1)}px !important`
  },
  headingContainer: {
    display: 'flex'
  },
  infoIconButton: {
    marginLeft: theme.spacing(0.5)
  },
  infoIcon: {
    fontSize: 32
  },
  label: {
    marginTop: theme.spacing(1),
    height: 32,
    overflow: 'auto'
  },
  content: {
    paddingTop: 0,
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(1),
    overflow: 'auto',
    display: 'block'
  }
})

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
    if (hasData) { label = data.prefLabel.prefLabel || data.prefLabel }
    return label
  }

  return (
    <Grid container spacing={1} className={props.classes.root}>
      <Accordion
        className={props.classes.panel}
        expanded={props.expanded}
      >
        <AccordionSummary
          className={props.classes.summary}
          classes={{
            content: props.classes.summaryContent
          }}
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
          IconButtonProps={{ onClick: handleExpandButtonOnClick }}
        >
          <div className={props.classes.headingContainer}>
            <Typography component='h1' variant='h4'>
              {props.pageType === 'facetResults' && intl.get(`perspectives.${props.resultClass}.label`)}
              {props.pageType === 'instancePage' && intl.get(`perspectives.${props.resultClass}.instancePage.label`)}
            </Typography>
            <IconButton className={props.classes.infoIconButton} onClick={handleExpandButtonOnClick}>
              <InfoIcon className={props.classes.infoIcon} />
            </IconButton>
          </div>
          {props.pageType === 'instancePage' &&
            <Typography className={props.classes.label} component='h1' variant='h6'>{generateLabel()}</Typography>}
        </AccordionSummary>
        <AccordionDetails
          className={props.classes.content}
          style={{ height: props.descriptionHeight }}
        >
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
    </Grid>
  )
}

InfoHeader.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  instanceData: PropTypes.object,
  pageType: PropTypes.string.isRequired,
  expanded: PropTypes.bool.isRequired,
  updateExpanded: PropTypes.func.isRequired,
  descriptionHeight: PropTypes.number.isRequired
}

export const InfoHeaderComponent = InfoHeader

export default withStyles(styles)(InfoHeader)
