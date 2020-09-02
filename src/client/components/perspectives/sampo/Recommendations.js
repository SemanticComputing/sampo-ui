import React from 'react'
import PropTypes from 'prop-types'
import LeafletMap from '../../facet_results/LeafletMap'
import TitleBarGridList from './TitleBarGridList'
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(4),
    width: '50%',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  gridItem: {
    width: '100%',
    padding: theme.spacing(2)
  },
  title: {
    marginBottom: theme.spacing(2)
  },
  content: {
    height: 450
  }

}))

const Recommendations = props => {
  const { tableData, results } = props
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} className={classes.gridItem}>
            <Typography className={classes.title} variant='h4'>Nearby finds</Typography>
            <div className={classes.content}>
              <LeafletMap
                center={[64.921472, 26.809735]}
                zoom={4}
                results={results}
                layers={props.leafletMap}
                pageType='instancePage'
                resultClass='nearbyFinds'
                uri={tableData.id}
                mapMode='cluster'
                showMapModeControl={false}
                instance={props.tableData}
                fetchResults={props.fetchResults}
                fetchGeoJSONLayers={props.fetchGeoJSONLayersBackend}
                clearGeoJSONLayers={props.clearGeoJSONLayers}
                fetchByURI={props.fetchByURI}
                fetching={false}
                showInstanceCountInClusters={false}
                showExternalLayers
                showError={props.showError}
              />
            </div>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={3} className={classes.gridItem}>
            <Typography className={classes.title} variant='h4'>Similar finds (static example)</Typography>
            <TitleBarGridList />
          </Paper>
        </Grid>
      </Grid>

    </div>
  )
}

Recommendations.propTypes = {
  fetchByURI: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  tableData: PropTypes.object,
  tableExternalData: PropTypes.object,
  results: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  resultUpdateID: PropTypes.number.isRequired,
  sparqlQuery: PropTypes.string,
  isLoading: PropTypes.bool.isRequired,
  fetchGeoJSONLayers: PropTypes.func.isRequired,
  clearGeoJSONLayers: PropTypes.func.isRequired,
  leafletMap: PropTypes.object.isRequired,
  showError: PropTypes.func.isRequired
}

export default Recommendations
