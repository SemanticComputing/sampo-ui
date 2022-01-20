import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import withStyles from '@mui/styles/withStyles'
import TableCell from '@mui/material/TableCell'
import TableSortLabel from '@mui/material/TableSortLabel'
import Tooltip from '@mui/material/Tooltip'
import ResultTableCell from './ResultTableCell'
import Paper from '@mui/material/Paper'
import { AutoSizer, Column, Table } from 'react-virtualized'
import intl from 'react-intl-universal'
import CircularProgress from '@mui/material/CircularProgress'

const styles = theme => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box'
  },
  table: {
    // temporary right-to-left patch, waiting for
    // https://github.com/bvaughn/react-virtualized/issues/454
    '& .ReactVirtualized__Table__headerRow': {
      flip: false,
      paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined
    },
    '& .ReactVirtualized__Table__rowColumn': {
      marginRight: theme.spacing(3)
    }
  },
  tableRow: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
  tableRowHover: {
    '&:hover': {
      backgroundColor: theme.palette.grey[200]
    }
  },
  tableCell: {
    flex: 1
  },
  tableCellWithSort: {
    marginRight: 16
  }
})

class MuiVirtualizedTable extends React.PureComponent {
  static defaultProps = {
    headerHeight: 48,
    rowHeight: 40
  };

  componentDidUpdate = prevProps => {
    if (prevProps.sortBy !== this.props.sortBy ||
      prevProps.sortDirection !== this.props.sortDirection) {
      this.forceUpdate()
    }
  }

  getRowClassName = ({ index }) => {
    const { classes, onRowClick } = this.props

    return clsx(classes.tableRow, classes.flexContainer, {
      [classes.tableRowHover]: index !== -1 && onRowClick != null
    })
  };

  cellRenderer = ({ cellData, columnIndex }) => {
    const { columns /* classes, rowHeight, onRowClick */ } = this.props
    const { id, valueType, makeLink, externalLink, sortValues, numberedList, minWidth, collapsedMaxWords } = columns[columnIndex]
    return (
      <ResultTableCell
        columnId={id}
        data={cellData}
        valueType={valueType}
        makeLink={makeLink}
        externalLink={externalLink}
        numberedList={numberedList}
        sortValues={sortValues}
        minWidth={minWidth}
        container='div'
        expanded={false}
        collapsedMaxWords={collapsedMaxWords}
        shortenLabel={false}
      />
    )
  };

  headerRenderer = ({ label, columnIndex, dataKey }) => {
    const { headerHeight, columns, classes, sortBy, sortDirection } = this.props
    return (
      <>
        <TableCell
          component='div'
          className={clsx(
            classes.tableCell,
            classes.flexContainer)}
          variant='head'
          style={{ height: headerHeight, textTransform: 'none' }}
          align={columns[columnIndex].numeric || false ? 'right' : 'left'}
        >
          <Tooltip
            title={`Sort by ${label}`}
            enterDelay={300}
          >
            <TableSortLabel
              active={sortBy === dataKey}
              direction={typeof sortDirection === 'string'
                ? sortDirection
                : 'asc'}
              hideSortIcon
              onClick={this.onSortBy(dataKey)}
            >
              {label}
            </TableSortLabel>
          </Tooltip>
        </TableCell>
      </>
    )
  }

  onSortBy = sortBy => () => {
    this.props.sortFullTextResults({
      resultClass: this.props.resultClass,
      sortBy
    })
  }

  render () {
    const { classes, columns, rowHeight, headerHeight, sortDirection, ...tableProps } = this.props
    return (
      <AutoSizer>
        {({ height, width }) => (
          <Table
            height={height}
            width={width}
            rowHeight={rowHeight}
            gridStyle={{
              direction: 'inherit'
            }}
            headerHeight={headerHeight}
            className={classes.table}
            {...tableProps}
            rowClassName={this.getRowClassName}
          >
            {columns.map(({ id, minWidth, ...other }, index) => {
              const label = intl.get(`perspectives.fullTextSearch.properties.${id}.label`)
              return (
                <Column
                  key={id}
                  headerRenderer={(headerProps) =>
                    this.headerRenderer({
                      ...headerProps,
                      label,
                      columnIndex: index,
                      dataKey: id
                    })}
                  className={classes.flexContainer}
                  cellRenderer={this.cellRenderer}
                  dataKey={id}
                  width={minWidth}
                  {...other}
                />
              )
            })}
          </Table>
        )}
      </AutoSizer>
    )
  }
}

MuiVirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      numeric: PropTypes.bool,
      minWidth: PropTypes.number
    })
  ).isRequired,
  headerHeight: PropTypes.number,
  onRowClick: PropTypes.func,
  rowHeight: PropTypes.number
}

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable)

const rootStyle = {
  height: 'calc(100% - 58px)',
  fontFamily: 'Roboto'
}

const tableContainer = {
  width: 1100,
  height: '100%',
  marginLeft: 'auto',
  marginRight: 'auto'
}

const progressContainerStyle = {
  width: '100%',
  height: 'calc(100% - 58px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}

const ReactVirtualizedTable = props => {
  const { results, properties, sortBy, sortDirection, fetching } = props.fullTextSearch
  return (
    <Paper square style={rootStyle}>
      {fetching
        ? (
          <div style={progressContainerStyle}>
            <CircularProgress />
          </div>
          )
        : (
          <div style={tableContainer}>
            <VirtualizedTable
              rowCount={results.length}
              rowGetter={({ index }) => results[index]}
              columns={properties}
              fetching={fetching}
              sortBy={sortBy}
              sortDirection={sortDirection}
              sortFullTextResults={props.sortFullTextResults}
              resultClass={props.resultClass}
            />
          </div>
          )}
    </Paper>
  )
}

export default ReactVirtualizedTable
