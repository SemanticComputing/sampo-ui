import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1)
  }
})

const InstanceList = props => {
  const { classes, data, listHeadingSingleInstance, listHeadingMultipleInstances } = props
  let items = ''
  const isArray = Array.isArray(data)
  if (isArray) {
    items = data.map(d =>
      <li key={d.id}>
        <Typography>
          <Link to={d.dataProviderUrl}>{d.prefLabel}</Link>
        </Typography>
      </li>)
  }
  return (
    <div className={classes.root}>
      {isArray &&
        <>
          <Typography>{listHeadingMultipleInstances}</Typography>
          <ul>
            {items}
          </ul>
        </>}
      {!isArray &&
        <>
          <Typography>{listHeadingSingleInstance}</Typography>
          <Typography>
            <Link to={data.dataProviderUrl}>{data.prefLabel}</Link>
          </Typography>
        </>}
    </div>
  )
}

InstanceList.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  listHeadingSingleInstance: PropTypes.string.isRequired,
  listHeadingMultipleInstances: PropTypes.string.isRequired
}

export default withStyles(styles)(InstanceList)
