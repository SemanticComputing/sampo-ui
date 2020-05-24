import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import purple from '@material-ui/core/colors/purple'
import PerspectiveTabs from './PerspectiveTabs'
import InstanceHomePageTable from './InstanceHomePageTable'
import LeafletMap from '../facet_results/LeafletMap'
import Export from '../facet_results/Export'
import { Route, Redirect } from 'react-router-dom'
import { has } from 'lodash'

const styles = () => ({
  root: {
    width: '100%',
    height: '100%'
  },
  content: {
    width: '100%',
    height: 'calc(100% - 72px)',
    overflow: 'auto'
  },
  spinnerContainer: {
    display: 'flex',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

/**
 * A component for generating a landing page for a single entity.
 */
class InstanceHomePage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      localID: null
    }
  }

  componentDidMount = () => this.fetchData()

  componentDidUpdate = prevProps => {
    if (prevProps.routeProps.location !== this.props.routeProps.location) {
      this.fetchData()
    }
  }

  fetchData = () => {
    let uri = ''
    const base = 'http://ldf.fi/mmm'
    const locationArr = this.props.routeProps.location.pathname.split('/')
    let localID = locationArr.pop()
    this.props.tabs.map(tab => {
      if (localID === tab.id) {
        localID = locationArr.pop() // pop again if tab id
      }
    })
    this.setState({ localID: localID })
    switch (this.props.resultClass) {
      case 'perspective1':
        uri = `${base}/manifestation_singleton/${localID}`
        break
      case 'perspective2':
        uri = `${base}/work/${localID}`
        break
      case 'perspective3':
        uri = `${base}/event/${localID}`
        break
      case 'manuscripts':
        uri = `${base}/manifestation_singleton/${localID}`
        break
      case 'expressions':
        uri = `${base}/expression/${localID}`
        break
      case 'collections':
        uri = `${base}/collection/${localID}`
        break
      case 'works':
        uri = `${base}/work/${localID}`
        break
      case 'events':
        uri = `${base}/event/${localID}`
        break
      case 'actors':
        uri = `${base}/actor/${localID}`
        break
      case 'places':
        uri = `${base}/place/${localID}`
        break
    }
    this.props.fetchByURI({
      resultClass: this.props.resultClass,
      facetClass: null,
      variant: null,
      uri: uri
    })
  }

  createPlaceArray = events => {
    let places = {}
    events = Array.isArray(events) ? events : [events]
    events.map(event => {
      if (has(event, 'place')) {
        const eventPlaces = Array.isArray(event.place) ? event.place : [event.place]
        eventPlaces.map(place => {
          if (!has(places, place.id)) {
            places[place.id] = {
              id: place.id,
              prefLabel: place.prefLabel,
              lat: place.lat,
              long: place.long,
              events: [event] // gather events here
            }
          } else {
            places[place.id].events.push(event)
          }
        })
      }
    })
    places = Object.values(places)
    places.forEach(place => {
      place.instanceCount = place.events.length
    })
    return places
  }

  getVisibleRows = rows => {
    const visibleRows = []
    const instanceClass = this.props.data.type ? this.props.data.type.id : ''
    rows.map(row => {
      if ((has(row, 'onlyForClass') && row.onlyForClass === instanceClass) ||
       !has(row, 'onlyForClass')) {
        visibleRows.push(row)
      }
    })
    return visibleRows
  }

  render = () => {
    const { classes, data, isLoading, resultClass, rootUrl } = this.props
    const hasData = data !== null && Object.values(data).length >= 1
    return (
      <div className={classes.root}>
        <PerspectiveTabs
          routeProps={this.props.routeProps}
          tabs={this.props.tabs}
          screenSize={this.props.screenSize}
        />
        <Paper square className={classes.content}>
          {isLoading &&
            <div className={classes.spinnerContainer}>
              <CircularProgress style={{ color: purple[500] }} thickness={5} />
            </div>}
          {!hasData &&
            <>
              <Typography variant='h6'>
                No data found for id: <span style={{ fontStyle: 'italic' }}>{this.state.localID}</span>
              </Typography>
            </>}
          {hasData &&
            <>
              <Route
                exact path={`${rootUrl}/${resultClass}/page/${this.state.localID}`}
                render={() => <Redirect to={`${rootUrl}/${resultClass}/page/${this.state.localID}/table`} />}
              />
              <Route
                path={[`${rootUrl}/${resultClass}/page/${this.state.localID}/table`, '/iframe.html']} // support also rendering in Storybook
                render={() =>
                  <InstanceHomePageTable
                    resultClass={resultClass}
                    data={data}
                    properties={this.getVisibleRows(this.props.properties)}
                  />}
              />
              <Route
                path={`${rootUrl}/${resultClass}/page/${this.state.localID}/map`}
                render={() =>
                  <LeafletMap
                    results={this.createPlaceArray(data.event)}
                    resultClass='instanceEvents'
                    pageType='instancePage'
                    mapMode='cluster'
                    instance={null}
                    fetchByURI={this.props.fetchByURI}
                    fetching={this.props.isLoading}
                    showInstanceCountInClusters
                  />}
              />
              <Route
                path={`${rootUrl}/${resultClass}/page/${this.state.localID}/export`}
                render={() =>
                  <Export
                    sparqlQuery={this.props.sparqlQuery}
                    pageType='instancePage'
                    id={data.id}
                  />}
              />
            </>}
        </Paper>
      </div>
    )
  }
}

InstanceHomePage.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchByURI: PropTypes.func.isRequired,
  resultClass: PropTypes.string.isRequired,
  data: PropTypes.object,
  sparqlQuery: PropTypes.string,
  properties: PropTypes.array.isRequired,
  tabs: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  routeProps: PropTypes.object.isRequired,
  screenSize: PropTypes.string.isRequired,
  rootUrl: PropTypes.string.isRequired
}

export const InstanceHomePageComponent = InstanceHomePage

export default withStyles(styles)(InstanceHomePage)
