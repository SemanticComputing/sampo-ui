import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import classNames from 'classnames'
import { withStyles } from '@material-ui/core/styles'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Tooltip from '@material-ui/core/Tooltip'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import IconButton from '@material-ui/core/IconButton'
import InfoIcon from '@material-ui/icons/InfoOutlined'

const styles = theme => ({
  headerCol: {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 1
  },
  emptyHeaderCol: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  }
})

const ResultTableHead = props => {
  const { classes, columns, sortBy, sortDirection, onSortBy } = props
  return (
    <TableHead>
      <TableRow>
        <td className={classNames(classes.headerCol, classes.emptyHeaderCol)} key='empty' />
        {columns.map(column => {
          if (column.onlyOnInstancePage) { return null }
          if (column.hideHeader) {
            return (
              <td className={classes.headerCol} key='empty2' />
            )
          }
          const label = intl.get(`perspectives.${props.resultClass}.properties.${column.id}.label`)
          const description = intl.get(`perspectives.${props.resultClass}.properties.${column.id}.description`)
          return (
            <React.Fragment key={column.id}>
              {column.disableSort
                ? (
                  <TableCell
                    className={classes.headerCol}
                  >
                    {label}
                    <Tooltip
                      title={description}
                      enterDelay={300}
                    >
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  )
                : (
                  <TableCell
                    className={classes.headerCol}
                    sortDirection={sortBy === column.id ? sortDirection : false}
                  >
                    <Tooltip
                      title={`Sort by ${label}`}
                      enterDelay={300}
                    >
                      <TableSortLabel
                        active={sortBy === column.id}
                        direction={sortDirection}
                        hideSortIcon
                        onClick={onSortBy(column.id)}
                      >
                        {label}
                      </TableSortLabel>
                    </Tooltip>
                    <Tooltip
                      title={description}
                      enterDelay={300}
                    >
                      <IconButton>
                        <InfoIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                  )}
            </React.Fragment>
          )
        })}
      </TableRow>
    </TableHead>
  )
}

ResultTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  onSortBy: PropTypes.func.isRequired,
  sortBy: PropTypes.string,
  sortDirection: PropTypes.string,
  routeProps: PropTypes.object.isRequired
}

export default withStyles(styles)(ResultTableHead)
