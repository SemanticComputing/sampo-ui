import React from 'react'
import withStyles from '@mui/styles/withStyles';
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Divider from '@mui/material/Divider'
import Tooltip from '@mui/material/Tooltip'
import { Link } from 'react-router-dom'
import { has } from 'lodash'
import parse from 'html-react-parser'
import { arrayToObject } from '../../helpers/helpers'

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(1)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeadingContainer: {
    display: 'flex',
    alignItems: 'center'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary
  },
  timeLink: {
    marginRight: theme.spacing(1)
  },
  activeAccordion: {
    border: '2px solid red'
  },
  accordionDetailsRoot: {
    flexDirection: 'column'
  },
  tocSubHeading: {
    marginTop: theme.spacing(1)
  },
  tooltip: {
    maxWidth: 500
  },
  tooltipContent: {
    padding: theme.spacing(1)
  }
})

class VideoTableOfContents extends React.Component {
  constructor (props) {
    super(props)
    const {
      mentionedPlace,
      mentionedPerson,
      mentionedOrganization,
      mentionedUnit,
      mentionedEvent,
      mentionedProduct
    } = props.instanceTableData
    let namedEntities = [
      ...(Array.isArray(mentionedPlace)
        ? mentionedPlace
        : [mentionedPlace]),
      ...(Array.isArray(mentionedPerson)
        ? mentionedPerson
        : [mentionedPerson]),
      ...(Array.isArray(mentionedOrganization)
        ? mentionedOrganization
        : [mentionedOrganization]),
      ...(Array.isArray(mentionedUnit)
        ? mentionedUnit
        : [mentionedUnit]),
      ...(Array.isArray(mentionedEvent)
        ? mentionedEvent
        : [mentionedEvent]),
      ...(Array.isArray(mentionedProduct)
        ? mentionedProduct
        : [mentionedProduct])
    ]
    if (namedEntities !== null) {
      namedEntities = arrayToObject({
        array: namedEntities,
        keyField: 'id'
      })
    }
    this.state = {
      expandedSet: new Set([]),
      currentPart: null,
      namedEntities
    }
  }

  componentDidUpdate = (prevProps, prevState) => {
    const currentPart = this.getCurrentPart()
    if (this.props.videoPlayerState.videoPlayerTime !== prevProps.videoPlayerState.videoPlayerTime) {
      this.setState({ currentPart })
    }
  }

  getCurrentPart = () => {
    const { videoPlayerTime } = this.props.videoPlayerState
    let currentPart = null
    let toc_ = this.props.toc
    if (!Array.isArray(toc_)) {
      toc_ = [this.props.toc]
    }
    for (const part of toc_) {
      if (part.beginTimeInSeconds <= videoPlayerTime && part.endTimeInSeconds > videoPlayerTime) {
        currentPart = part
        break // there are errors in timecodes, choose only the first part that fits the condition
      }
    }
    return currentPart
  }

  renderTooltip = (domNode, namedEntityID) => {
    let tooltipContent = namedEntityID
    if (has(this.state.namedEntities, namedEntityID)) {
      const entity = this.state.namedEntities[namedEntityID]
      const tooltipHeading = has(entity, 'wikipediaLink')
        ? (
          <p>
            <a href={entity.wikipediaLink} target='_blank' rel='noopener noreferrer'>
              {entity.prefLabel} (Wikipedia)
            </a>
          </p>
          )
        : (<p>{entity.prefLabel} (Wikipedia)</p>)
      tooltipContent = (
        <div className={this.props.classes.tooltipContent}>
          {tooltipHeading}
          <p>
            {entity.description}
          </p>
        </div>
      )
    }
    return (
      <Tooltip
        title={tooltipContent}
        interactive
        placement='top'
        arrow
        classes={{
          tooltip: this.props.classes.tooltip
        }}
      >
        <span
          style={{
            textDecoration: 'underline',
            cursor: 'pointer'
          }}
        >
          {domNode.children[0].data}
        </span>
      </Tooltip>
    )
  }

  renderLink = (domNode, namedEntityID) => {
    if (has(this.state.namedEntities, namedEntityID)) {
      const entity = this.state.namedEntities[namedEntityID]
      return (
        <Link to={entity.dataProviderUrl}>
          {domNode.children[0].data}
        </Link>
      )
    } else {
      return (
        <>
          {domNode.children[0].data}
        </>
      )
    }
  }

  parseHTMLTextSlice = slice => {
    const html = parse(slice.annotatedTextContent, {
      replace: domNode => {
        if (domNode.type === 'tag' && domNode.name === 'span' &&
        has(domNode.attribs, 'data-link')) {
          const namedEntityID = domNode.attribs['data-link']
          return this.renderTooltip(domNode, namedEntityID)
        }
      }
    })
    return (
      <li key={slice.order}>{html}</li>
    )
  }

  parseHTMLTimeSlice = annotatedTextContent => {
    const html = parse(annotatedTextContent, {
      replace: domNode => {
        if (domNode.type === 'tag' && domNode.name === 'span' &&
        has(domNode.attribs, 'data-uri')) {
          const namedEntityID = domNode.attribs['data-uri']
          return this.renderLink(domNode, namedEntityID)
        }
      }
    })
    return (
      <p>
        {html}
      </p>
    )
  }

  handleAccordionOnChange = rowID => () => {
    const { expandedSet } = this.state
    if (expandedSet.has(rowID)) {
      expandedSet.delete(rowID)
    } else {
      expandedSet.add(rowID)
    }
    this.setState({ expandedSet })
  }

  render () {
    const { classes, toc, textFormat } = this.props
    const { expandedSet } = this.state
    let toc_ = toc
    if (!Array.isArray(toc)) {
      toc_ = [toc]
    }
    return (
      <div className={classes.root}>
        {toc_.map(row => {
          const rowID = row.order
          let isCurrent = false
          if (this.state.currentPart && rowID === this.state.currentPart.order) {
            isCurrent = true
          }
          const expanded = expandedSet.has(rowID) || isCurrent
          const hasPlaceLinks = has(row, 'mentionedPlace')
          const hasPersonLinks = has(row, 'mentionedPerson')
          const hasUnitLinks = has(row, 'mentionedUnit')
          const hasOrganizationLinks = has(row, 'mentionedOrganization')
          const hasEventLinks = has(row, 'mentionedEvent')
          const hasProductLinks = has(row, 'mentionedProduct')
          const hasNamedEntityLinks =
            hasPlaceLinks ||
            hasPersonLinks ||
            hasUnitLinks ||
            hasOrganizationLinks ||
            hasEventLinks ||
            hasProductLinks
          const hasTextSlices = has(row, 'textSlice')
          if (hasPlaceLinks) {
            if (Array.isArray(row.mentionedPlace)) {
              row.mentionedPlace.forEach(place => {
                if (Array.isArray(place.prefLabel)) {
                  place.prefLabel = place.prefLabel[0]
                }
              })
              row.mentionedPlace.sort((a, b) => a.prefLabel.localeCompare(b.prefLabel))
            }
          }
          const timeSliceHasAnnotatedTextContent = has(row, 'annotatedTextContent')
          return (
            <Accordion
              className={isCurrent ? classes.activeAccordion : null}
              key={rowID}
              expanded={expanded}
              onChange={this.handleAccordionOnChange(rowID)}
            >
              <AccordionSummary
                style={{
                  root: {
                    '&$expanded': { minHeight: 15 }
                  },
                  content: {
                    '&$expanded': { marginBottom: 0 }
                  }
                }}
                expandIcon={<ExpandMoreIcon />}
                IconButtonProps={{
                  disabled: isCurrent
                }}
                aria-label='Expand'
                aria-controls={`${rowID}-content`}
                id={`${rowID}-header`}
              >
                <Link
                  className={classes.timeLink}
                  to={{ hash: row.beginTimeInSeconds }}
                  replace
                  onClick={event => {
                    if (expanded) {
                      event.stopPropagation()
                    }
                  }}
                  onFocus={event => event.stopPropagation()}
                >
                  <Typography className={classes.heading}>
                    {row.beginTimeLabel}
                  </Typography>
                </Link>
                {!expanded &&
                  <div className={classes.secondaryHeadingContainer}>
                    <Typography className={classes.secondaryHeading}>{row.prefLabel}</Typography>
                  </div>}

              </AccordionSummary>
              <AccordionDetails
                classes={{
                  root: classes.accordionDetailsRoot
                }}
              >
                <Typography>Haastattelijan muistiinpanot</Typography>
                {textFormat === 'plain-text-from-text-slice' && hasTextSlices &&
                  <ul>
                    {Array.isArray(row.textSlice)
                      ? row.textSlice.map(slice => <li key={slice.order}>{slice.textContent}</li>)
                      : <li key={row.textSlice.order}>{row.textSlice.textContent}</li>}
                  </ul>}
                {textFormat === 'annotated-html-from-text-slice' && hasTextSlices &&
                  <ul>
                    {Array.isArray(row.textSlice)
                      ? row.textSlice.map(slice => this.parseHTMLTextSlice(slice))
                      : this.parseHTMLTextSlice(row.textSlice)}
                  </ul>}
                {textFormat === 'annotated-html-from-time-slice' && timeSliceHasAnnotatedTextContent &&
                  this.parseHTMLTimeSlice(row.annotatedTextContent)}
                {hasNamedEntityLinks &&
                  <>
                    <Divider />
                    <Typography className={classes.tocSubHeading}>Automaattisesti tunnistetut</Typography>
                    <ul>
                      {hasPlaceLinks &&
                        <li>paikat
                          <ul>
                            {Array.isArray(row.mentionedPlace)
                              ? row.mentionedPlace.map(place =>
                                <li key={place.id}><Link to={place.dataProviderUrl}>{place.prefLabel}</Link></li>)
                              : <li key={row.mentionedPlace.id}><Link to={row.mentionedPlace.dataProviderUrl}>{row.mentionedPlace.prefLabel}</Link></li>}
                          </ul>
                        </li>}
                      {hasPersonLinks &&
                        <li>henkilöt
                          <ul>
                            {Array.isArray(row.mentionedPerson)
                              ? row.mentionedPerson.map(person =>
                                <li key={person.id}><Link to={person.dataProviderUrl}>{person.prefLabel}</Link></li>)
                              : <li key={row.mentionedPerson.id}><Link to={row.mentionedPerson.dataProviderUrl}>{row.mentionedPerson.prefLabel}</Link></li>}
                          </ul>
                        </li>}
                      {hasUnitLinks &&
                        <li>joukko-osastot
                          <ul>
                            {Array.isArray(row.mentionedUnit)
                              ? row.mentionedUnit.map(unit =>
                                <li key={unit.id}><Link to={unit.dataProviderUrl}>{unit.prefLabel}</Link></li>)
                              : <li key={row.mentionedUnit.id}><Link to={row.mentionedUnit.dataProviderUrl}>{row.mentionedUnit.prefLabel}</Link></li>}
                          </ul>
                        </li>}
                      {hasOrganizationLinks &&
                        <li>organisaatiot
                          <ul>
                            {Array.isArray(row.mentionedOrganization)
                              ? row.mentionedOrganization.map(organization =>
                                <li key={organization.id}><Link to={organization.dataProviderUrl}>{organization.prefLabel}</Link></li>)
                              : <li key={row.mentionedOrganization.id}><Link to={row.mentionedOrganization.dataProviderUrl}>{row.mentionedOrganization.prefLabel}</Link></li>}
                          </ul>
                        </li>}
                      {hasEventLinks &&
                        <li>tapahtumat
                          <ul>
                            {Array.isArray(row.mentionedEvent)
                              ? row.mentionedEvent.map(event =>
                                <li key={event.id}><Link to={event.dataProviderUrl}>{event.prefLabel}</Link></li>)
                              : <li key={row.mentionedEvent.id}><Link to={row.mentionedEvent.dataProviderUrl}>{row.mentionedEvent.prefLabel}</Link></li>}
                          </ul>
                        </li>}
                      {hasProductLinks &&
                        <li>nimikkeet
                          <ul>
                            {Array.isArray(row.mentionedProduct)
                              ? row.mentionedProduct.map(product =>
                                <li key={product.id}><Link to={product.dataProviderUrl}>{product.prefLabel}</Link></li>)
                              : <li key={row.mentionedProduct.id}><Link to={row.mentionedProduct.dataProviderUrl}>{row.mentionedProduct.prefLabel}</Link></li>}
                          </ul>
                        </li>}
                    </ul>
                  </>}
              </AccordionDetails>
            </Accordion>
          )
        }
        )}
      </div>
    )
  }
}

export default withStyles(styles)(VideoTableOfContents)
