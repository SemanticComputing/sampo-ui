import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import classNames from 'classnames'
import withStyles from '@mui/styles/withStyles'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import InfoIcon from '@mui/icons-material/InfoOutlined'

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
                      <IconButton size='large'>
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
                        direction={sortBy === column.id ? sortBy : 'asc'}
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
                      <IconButton size='large'>
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
  sortDirection: PropTypes.string
}

export default withStyles(styles)(ResultTableHead)
