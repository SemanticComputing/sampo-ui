import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import { stateToUrl } from '../../helpers/helpers'
import { Alert, AlertTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import intl from 'react-intl-universal'
import parse from 'html-react-parser'

const styles = theme => ({
  root: {
    height: 'calc(100% - 72px)',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderTop: '1px solid rgba(224, 224, 224, 1);',
    flexDirection: 'column'
  },
  link: {
    textDecoration: 'none'
  },
  button: {
    margin: theme.spacing(3)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  },
  alert: {
    margin: theme.spacing(1),
    width: '75%',
    boxSizing: 'border-box'
  },
  linkContainer: {
    margin: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    width: '75%'
  },
  linkField: {
    width: '100%',
    textOverflow: 'ellipsis'
  }
})

/**
 * A component for creating a link to a specific search.
 */
class ExportLink extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      downloadLink: '',
      selectedView: 'table'
    }
    this.handleViewChange = this.handleViewChange.bind(this)
  }

  componentDidMount = () => {
    this.setState({ downloadLink: this.createLink() })
  }

  componentDidUpdate = prevProps => {
    // check if filters have changed
    if (prevProps.facetUpdateID !== this.props.facetUpdateID) {
      this.setState({ downloadLink: this.createLink() })
    }
  }

  createLink = () => {
    const params = stateToUrl({
      facetClass: this.props.facetClass,
      facets: this.props.facets
    })

    const constraints = params.constraints ? params.constraints : []
    const mappedConstraints = []
    // go through constraints
    for (const constraint of constraints) {
      const facetId = constraint.facetID
      const filterType = constraint.filterType
      let value

      switch (constraint.filterType) {
        case 'uriFilter':
          // go through each object (can have multiple)
          for (const [k, v] of Object.entries(this.props.facets[constraint.facetID].uriFilter)) {
            value = {
              path: v.path,
              node: {
                id: k,
                prefLabel: v.node.prefLabel,
                instanceCount: v.node.instanceCount,
                ...(v.node.parent && { parent: v.node.parent }),
                ...(v.node.children && { children: v.node.children.map(child => ({ id: child.id, prefLabel: child.prefLabel, instanceCount: child.instanceCount })) })
              }
            }
            mappedConstraints.push({ facetId: facetId, filterType: filterType, value: value })
          }
          break
        case 'textFilter':
          value = this.props.facets[constraint.facetID].textFilter
          mappedConstraints.push({ facetId: facetId, filterType: filterType, value: value })
          break
        case 'dateFilter':
        case 'timespanFilter':
        case 'directTimespanFilter':
          value = [this.props.facets[constraint.facetID].timespanFilter.start, this.props.facets[constraint.facetID].timespanFilter.end]
          mappedConstraints.push({ facetId: facetId, filterType: filterType, value: value })
          break
        case 'dateNoTimespanFilter':
          value = [this.props.facets[constraint.facetID].dateNoTimespanFilter.start, this.props.facets[constraint.facetID].dateNoTimespanFilter.end]
          mappedConstraints.push({ facetId: facetId, filterType: filterType, value: value })
          break
        case 'integerFilter':
        case 'integerFilterRange':
          value = [this.props.facets[constraint.facetID].integerFilter.start, this.props.facets[constraint.facetID].integerFilter.end]
          mappedConstraints.push({ facetId: facetId, filterType: filterType, value: value })
          break
        default:
          break
      }
    }

    const pageNumber = this.props.data.page === -1 ? 0 : this.props.data.page
    const pageNumberString = this.state.selectedView === 'table' ? `page=${pageNumber}` : ''
    const constraintsString = mappedConstraints.length > 0 ? `constraints=${encodeURIComponent(JSON.stringify(mappedConstraints))}` : ''
    const separator = (pageNumberString.length > 0 && constraintsString.length > 0) ? '&' : ''
    const queryString = (pageNumberString.length > 0 || constraintsString.length > 0) ? `?${pageNumberString}${separator}${constraintsString}` : ''
    return `${this.props.rootUrl}/${this.props.facetClass}/faceted-search/${this.state.selectedView}${queryString}`
  }

  updateDownloadLink = () => {
    this.setState({ downloadLink: this.createLink() })
  }

  handleViewChange (event) {
    this.setState({ selectedView: event.target.value }, () => { this.updateDownloadLink() })
  }

  render = () => {
    const { classes } = this.props
    const fullLink = window.location.origin + this.state.downloadLink
    const fieldLabel = intl.get('exportLink.fieldLabel') ? intl.get('exportLink.fieldLabel') : 'Generated link (read-only)'
    const infoBody = intl.getHTML('exportLink.infoBody') ? intl.getHTML('exportLink.infoBody') : 'You can share the query you made by using the link below. The link is generated based on what you have selected for different facets and will open the search view of this perpsective with those choices on the selected tab. You can change the opened tab to any of the supported ones using the dropdown menu below. If you make additional choices while on this page, the link will be automatically updated to include those.'
    const warningTitle = intl.get('exportLink.warningTitle') ? intl.get('exportLink.warningTitle') : 'Generated link might be too long for some browsers'
    const warningBody = intl.getHTML('exportLink.warningBody') ? intl.getHTML('exportLink.warningBody') : parse('The current length of the generated link is more than 2,000 characters. Browsers have different limits for the maximum lengths of links they can handle. <strong>This link might not work on all browsers</strong> — you can reduce the length of the link by deselecting some facet options.')
    const errorTitle = intl.get('exportLink.errorTitle') ? intl.get('exportLink.errorTitle') : 'Generated link is too long'
    const errorBody = intl.getHTML('exportLink.errorBody') ? intl.getHTML('exportLink.errorBody') : parse('The current length of the generated link is more than 15,800 characters. <strong>The server will refuse to handle requests that go over certain length limits</strong> — you can reduce the length of the link by deselecting some facet options.')
    const copyLinkToClipboard = intl.get('exportLink.copyLinkToClipboard') ? intl.get('exportLink.copyLinkToClipboard') : 'Copy link to clipboard'

    const acceptedComponentTypes = ['ApexCharts', 'ApexChartsDouble', 'LeafletMap', 'Deck', 'Network']
    const defaultTab = this.props.perspectiveConfig.resultClasses[this.props.perspectiveConfig.id].paginatedResultsConfig
    const suitableResultClasses = Object.values(this.props.perspectiveConfig.resultClasses).filter(resultClass => acceptedComponentTypes.includes(resultClass.component))
    return (
      <Paper square className={classes.root}>
        <Alert severity='info' className={classes.alert}>{infoBody}</Alert>
        {fullLink.length > 2000 && fullLink.length <= 15800 ? (<Alert severity='warning' className={classes.alert}><AlertTitle>{warningTitle}</AlertTitle>{warningBody}</Alert>) : ''}
        {fullLink.length > 15800 ? (<Alert severity='error' className={classes.alert}><AlertTitle>{errorTitle}</AlertTitle>{errorBody}</Alert>) : ''}
        <div className={classes.linkContainer}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id='view-select-helper-label'>{intl.get('exportLink.viewLabel')}</InputLabel>
            <Select
              labelId='view-select-helper-label'
              value={this.state.selectedView}
              label={intl.get('exportLink.viewLabel')}
              onChange={this.handleViewChange}
            >
              <MenuItem value={defaultTab.tabPath} default>{intl.get(`tabs.${defaultTab.tabPath}`) ? intl.get(`tabs.${defaultTab.tabPath}`) : defaultTab.tabPath}</MenuItem>
              {suitableResultClasses.map(resultClass => <MenuItem value={resultClass.tabPath} key={resultClass.tabPath}>{intl.get(`tabs.${resultClass.tabPath}`) ? intl.get(`tabs.${resultClass.tabPath}`) : resultClass.tabPath}</MenuItem>)}
            </Select>
            <FormHelperText>{intl.get('exportLink.viewInstructions')}</FormHelperText>
          </FormControl>
          <TextField className={classes.linkField} label={fieldLabel} value={fullLink} InputProps={{ readOnly: true }} variant='filled' size='small' disabled={fullLink.length > 15800} />
          <Button variant='contained' color='primary' className={classes.button} onClick={() => navigator.clipboard.writeText(fullLink)} disabled={fullLink.length > 15800}>
            {copyLinkToClipboard}
          </Button>
        </div>
      </Paper>
    )
  }
}

ExportLink.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  facets: PropTypes.object.isRequired,
  facetUpdateID: PropTypes.number.isRequired,
  rootUrl: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
}

export const ExportLinkComponent = ExportLink

export default withStyles(styles)(ExportLink)
