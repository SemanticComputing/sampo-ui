import React from 'react'
import PropTypes from 'prop-types'
import makeStyles from '@mui/styles/makeStyles'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/InfoOutlined'
import Tooltip from '@mui/material/Tooltip'
import intl from 'react-intl-universal'

const useStyles = makeStyles(theme => ({
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
  label: {
    marginTop: theme.spacing(1),
    height: 32,
    overflow: 'auto'
  },
  expandedContent: props => ({

  })
}))

/**
 * A component for instructions for a faceted search perspective or an entity landing page.
 */
const InfoHeader = props => {
  const handleAccordionChange = () => () => {
    props.updateExpanded({
      resultClass: props.resultClass,
      pageType: props.pageType
    })
  }

  const generateLabel = () => {
    let label = ''
    const data = props.instanceData
    const hasData = data !== null && Object.values(data).length >= 1
    if (hasData && data.prefLabel) {
      if (Array.isArray(data.prefLabel)) {
        label = data.prefLabel[0].prefLabel
      } else {
        label = data.prefLabel.prefLabel || data.prefLabel
      }
    }
    return label
  }

  const getHeadingVariant = () => {
    const { layoutConfig } = props
    const { infoHeader } = layoutConfig
    const theme = useTheme()
    const defaultHeight = useMediaQuery(theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint))
    const variant = defaultHeight
      ? infoHeader.default.headingVariant
      : infoHeader.reducedHeight.headingVariant
    return variant
  }

  const classes = useStyles(props)

  return (
    <Box
      sx={theme => ({
        marginTop: theme.spacing(0.5),
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5)

      })}
    >
      <Accordion expanded={props.expanded} onChange={handleAccordionChange()}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='infoheader-content'
          id='infoheader-header'
          sx={theme => ({
            paddingLeft: theme.spacing(1),
            minHeight: props.layoutConfig.infoHeader.reducedHeight.height,
            [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
              minHeight: props.layoutConfig.infoHeader.default.height
            },
            '& .MuiAccordionSummary-content': {
              display: 'block',
              marginTop: theme.spacing(0.5),
              marginBottom: theme.spacing(0.5)
            }
          })}
        >
          <Box
            sx={{
              display: 'flex'
            }}
          >
            <Typography
              sx={{
                flexShrink: 1
              }}
              component='h1'
              variant={getHeadingVariant()}
            >
              {props.pageType === 'facetResults' &&
                intl.get(`perspectives.${props.resultClass}.label`)}
              {props.pageType === 'instancePage' &&
                intl.get(`perspectives.${props.resultClass}.instancePage.label`)}
            </Typography>
            <Tooltip title={intl.get('infoHeader.toggleInstructions')}>
              <IconButton
                aria-label='toggle instructions'
                className={classes.infoIconButton}
                size='large'
                sx={theme => ({
                  padding: 0,
                  marginLeft: '4px !important',
                  '& .MuiSvgIcon-root': {
                    fontSize: props.layoutConfig.infoHeader.reducedHeight.infoIconFontSize,
                    [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
                      fontSize: props.layoutConfig.infoHeader.default.infoIconFontSize
                    }
                  }
                })}
              >
                <InfoIcon className={classes.infoIcon} />
              </IconButton>
            </Tooltip>
          </Box>
          {props.pageType === 'instancePage' &&
            <Typography
              component='h1'
              variant='h6'
              sx={theme => ({
                marginTop: theme.spacing(1),
                height: 32,
                overflow: 'auto'
              })}
            >
              {generateLabel()}
            </Typography>}
        </AccordionSummary>
        <AccordionDetails
          // className={classes.expandedContent}
          sx={theme => ({
            paddingTop: 0,
            paddingLeft: theme.spacing(1),
            paddingBottom: theme.spacing(1),
            marginBottom: theme.spacing(0),
            height: props.layoutConfig.infoHeader.reducedHeight.expandedContentHeight,
            overflow: 'auto',
            display: 'block',
            '& p, & ul': {
              ...theme.typography.body1,
              fontSize: '0.8rem'
            },
            '& h6': {
              ...theme.typography.h6,
              marginTop: 0,
              marginBottom: 0
            },
            '& p:first-of-type': {
              marginTop: 0
            },
            [theme.breakpoints.up(props.layoutConfig.reducedHeightBreakpoint)]: {
              height: props.layoutConfig.infoHeader.default.expandedContentHeight,
              '& p, & ul': {
                fontSize: '1rem !important;'
              }
            }
          })}
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
    </Box>
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

export const InfoHeaderComponent = InfoHeader

export default InfoHeader
