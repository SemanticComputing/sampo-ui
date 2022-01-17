import React from 'react'
import PropTypes from 'prop-types'
import withStyles from '@mui/styles/withStyles';
import { CSVLink } from 'react-csv'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import Button from '@mui/material/Button'
import intl from 'react-intl-universal'

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  csvLink: {
    textDecoration: 'none'
  },
  csvButton: {
    margin: theme.spacing(3)
  },
  rightIcon: {
    marginLeft: theme.spacing(1)
  }
})

/**
 * A Component for exporting client-side facet results as CSV.
 */
const CSVButton = props => {
  const { classes } = props

  return (
    <div className={classes.root}>
      <CSVLink className={classes.csvLink} data={props.results}>
        <Button variant='contained' color='primary' className={classes.csvButton}>
          {intl.get('resultsAsCSV')}
          <CloudDownloadIcon className={classes.rightIcon} />
        </Button>
      </CSVLink>
    </div>
  )
}

CSVButton.propTypes = {
  /**
   * Material-UI styles.
   */
  classes: PropTypes.object.isRequired,
  /**
   * Facet results as an array of objects.
   */
  results: PropTypes.array.isRequired
}

export const CSVButtonComponent = CSVButton

export default withStyles(styles)(CSVButton)
