import React from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import withStyles from '@mui/styles/withStyles'
import clsx from 'clsx'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import ResultTableCell from './ResultTableCell'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import querystring from 'querystring'
import ResultTableHead from './ResultTableHead'
import TablePagination from '@mui/material/TablePagination'
import ResultTablePaginationActions from './ResultTablePaginationActions'
import history from '../../History'

const styles = theme => ({
  tableContainer: props => ({
    overflow: 'auto',
    '& td, & th': {
      fontSize: props.layoutConfig.tableFontSize
    },
    [theme.breakpoints.up(props.layoutConfig.hundredPercentHeightBreakPoint)]: {
      height: `calc(100% - ${props.layoutConfig.tabHeight + props.layoutConfig.paginationToolbarHeight + 2}px)`
    },
    backgroundColor: theme.palette.background.paper,
    borderTop: '1px solid rgba(224, 224, 224, 1);'
  }),
  // paginationRoot: {
  //   display: 'flex',
  //   backgroundColor: '#fff',
  //   borderTop: '1px solid rgba(224, 224, 224, 1);',
  //   alignItems: 'center'
  // },
  // paginationCaption: {
  //   minWidth: 110
  // },
  // paginationToolbar: props => ({
  //   '& p': { fontSize: '0.75rem' },
  //   minHeight: props.layoutConfig.paginationToolbarHeight,
  //   [theme.breakpoints.down(undefined)]: {
  //     display: 'flex',
  //     flexWrap: 'wrap',
  //     marginTop: theme.spacing(0.5)
  //   }
  // }),
  progressContainer: {
    width: '100%',
    height: 'calc(100% - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  expandCell: {
    paddingRight: '0px !important'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  }
})

/**
 * A component for showing facet results as paginated table.
 * Based on Material-UI's Table component.
 */
class ResultTable extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expandedRows: new Set(),
      defaultFacetFetchingRequired: false
    }
  }

  componentDidMount = () => {
    let page
    let constraints = []

    // first check if page or constraints were given as url parameter
    if (this.props.location && this.props.location.search === '') {
      page = this.props.data.page === -1 ? 0 : this.props.data.page
    } else {
      const qs = this.props.location.search.replace('?', '')
      page = parseInt(querystring.parse(qs).page) ? parseInt(querystring.parse(qs).page) : 0
      const parsedConstraints = querystring.parse(qs).constraints
      constraints = parsedConstraints ? JSON.parse(decodeURIComponent(parsedConstraints)) : []
    }

    // update imported facets
    for (const constraint of constraints) {
      this.props.updateFacetOption({
        facetClass: this.props.facetClass,
        facetID: constraint.facetId,
        option: constraint.filterType,
        value: constraint.value
      })
    }

    // then update app state and url accordingly
    this.props.updatePage(this.props.resultClass, page)
    history.replace({
      pathname: `${this.props.rootUrl}/${this.props.resultClass}/faceted-search/table`,
      search: `?page=${page}`
    })

    // check if facet updates have been made before or dynamic language tag is active for perspective
    if (this.props.facetUpdateID > 0 || this.props.perspectiveConfig.enableDynamicLanguageChange) {
      this.fetchResults()
    }

    // check if default facets need to be refetched due to imported facets
    if (constraints.length > 0) {
      this.setState({ defaultFacetFetchingRequired: true })
    }
  }

  componentDidUpdate = prevProps => {
    // always fetch new results when page has updated
    if (prevProps.data.page !== this.props.data.page) {
      this.fetchResults()
      history.replace({
        pathname: `${this.props.rootUrl}/${this.props.resultClass}/faceted-search/table`,
        search: `?page=${this.props.data.page}`
      })
    }

    // check if facets are still fetching
    let someFacetIsFetching = false
    if (this.props.facetState) Object.values(this.props.facetState.facets).forEach(facet => { if (facet.isFetching) { someFacetIsFetching = true } })
    // refetch default facets (excl. text facets) when facets have been updated
    if (this.state.defaultFacetFetchingRequired && this.props.facetUpdateID > 0 && !someFacetIsFetching) {
      const defaultFacets = this.props.perspectiveConfig.defaultActiveFacets
      for (const facet of defaultFacets) {
        if (this.props.perspectiveConfig.facets[facet].filterType !== 'textFilter') this.props.fetchFacet({ facetClass: this.props.facetClass, facetID: facet })
      }
      this.setState({ defaultFacetFetchingRequired: false })
    }

    // when sort property or direction changes, return to first page
    if (this.needNewResults(prevProps)) {
      if (this.props.data.page === 0) {
        this.fetchResults()
      } else {
        this.props.updatePage(this.props.resultClass, 0)
      }
    }

    // handle browser's back button
    window.onpopstate = () => {
      const qs = this.props.location.search.replace('?', '')
      const newPage = parseInt(querystring.parse(qs).page)
      if (newPage !== this.props.data.page) {
        this.props.updatePage(this.props.resultClass, newPage)
      }
    }
  }

  fetchResults = () => {
    this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy)
  }

  needNewResults = prevProps => {
    return (
      prevProps.data.sortBy !== this.props.data.sortBy ||
      prevProps.data.sortDirection !== this.props.data.sortDirection ||
      (!this.state.defaultFacetFetchingRequired && prevProps.facetUpdateID !== this.props.facetUpdateID) ||
      prevProps.data.pagesize !== this.props.data.pagesize
    )
  }

  handlePageChange = (event, page) => {
    if (event != null && !this.props.data.fetching) {
      this.props.updatePage(this.props.resultClass, page)
    }
  }

  handleRowsPerPageChange = event => {
    const rowsPerPage = event.target.value
    if (rowsPerPage !== this.props.data.pagesize) {
      this.props.updateRowsPerPage(this.props.resultClass, rowsPerPage)
    }
  }

  handleSortBy = sortBy => event => {
    if (event != null) {
      this.props.sortResults(this.props.resultClass, sortBy)
    }
  }

  handleExpandRow = rowId => event => this.updateExpanedRows(rowId)

  handleExpandRowFromChildComponent = rowId => this.updateExpanedRows(rowId)

  updateExpanedRows = rowId => {
    const expandedRows = this.state.expandedRows
    if (expandedRows.has(rowId)) {
      expandedRows.delete(rowId)
    } else {
      expandedRows.add(rowId)
    }
    this.setState({ expandedRows })
  }

  rowRenderer = row => {
    const { classes, screenSize, data } = this.props
    const expanded = data.paginatedResultsAlwaysExpandRows
      ? true
      : this.state.expandedRows.has(row.id)
    let hasExpandableContent = false
    let renderExpandButton
    const dataCells = this.props.data.properties.map(column => {
      const {
        id, valueType, makeLink, externalLink, sortValues, sortBy, sortByConvertDataTypeTo, numberedList, minWidth,
        height, linkAsButton, collapsedMaxWords, showExtraCollapseButton, sourceExternalLink, renderAsHTML, HTMLParserTask
      } = column
      let { previewImageHeight } = column
      if (screenSize === 'xs' || screenSize === 'sm') {
        previewImageHeight = 50
      }
      if (column.onlyOnInstancePage) { return null }
      const columnData = row[column.id] == null ? '-' : row[column.id]
      const isArray = Array.isArray(columnData)
      if (isArray) {
        hasExpandableContent = true
      }
      // if there are multiple images, they can be viewed by clicking the preview image,
      // not by expanding
      if (column.valueType === 'image' && Array.isArray(columnData)) {
        hasExpandableContent = false
      }
      let shortenLabel = false
      // check if label should be shortened in ResultTableCell
      if (!isArray && column.collapsedMaxWords && columnData !== '-') {
        if (column.valueType === 'string' && columnData.split(' ').length > column.collapsedMaxWords) {
          hasExpandableContent = true
          shortenLabel = !expanded // shorten label only if the cell is not expanded
        }
        if (column.valueType === 'object' && columnData.prefLabel.split(' ').length > column.collapsedMaxWords) {
          hasExpandableContent = true
          shortenLabel = !expanded // shorten label only if the cell is not expanded
        }
      }
      renderExpandButton = data.paginatedResultsAlwaysExpandRows
        ? false
        : hasExpandableContent
      return (
        <ResultTableCell
          key={id}
          rowId={row.id}
          columnId={id}
          tableData={data}
          data={columnData}
          valueType={valueType}
          makeLink={makeLink}
          externalLink={externalLink}
          sortValues={sortValues}
          sortBy={sortBy}
          sortByConvertDataTypeTo={sortByConvertDataTypeTo}
          numberedList={numberedList}
          height={height}
          minWidth={minWidth}
          previewImageHeight={previewImageHeight}
          container='cell'
          expanded={expanded}
          onExpandClick={this.handleExpandRowFromChildComponent}
          linkAsButton={linkAsButton}
          collapsedMaxWords={collapsedMaxWords}
          showExtraCollapseButton={showExtraCollapseButton}
          shortenLabel={shortenLabel}
          showSource={false}
          sourceExternalLink={sourceExternalLink}
          renderAsHTML={renderAsHTML}
          HTMLParserTask={HTMLParserTask}
          referencedTerm={columnData.referencedTerm}
        />
      )
    })
    return (
      <TableRow key={row.id}>
        <TableCell className={classes.expandCell}>
          {renderExpandButton &&
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded
              })}
              onClick={this.handleExpandRow(row.id)}
              aria-expanded={expanded}
              aria-label='Show more'
              size='large'
            >
              <ExpandMoreIcon />
            </IconButton>}
        </TableCell>
        {dataCells}
      </TableRow>
    )
  }

  render () {
    const { classes } = this.props
    const { resultCount, paginatedResults, page, pagesize, sortBy, sortDirection, fetching } = this.props.data
    return (
      <>
        <TablePagination
          component='div'
          // classes={{
          //   root: classes.paginationRoot,
          //   caption: classes.paginationCaption,
          //   toolbar: classes.paginationToolbar
          // }}
          count={resultCount == null ? 0 : resultCount}
          labelDisplayedRows={resultCount == null
            ? () => '-'
            : ({ from, to, count }) => `${from}-${to} of ${count}`}
          rowsPerPage={parseInt(pagesize)}
          labelRowsPerPage={intl.get('table.rowsPerPage')}
          rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100]}
          page={page === -1 || resultCount === 0 ? 0 : page}
          SelectProps={{
            inputProps: { 'aria-label': 'rows per page' },
            native: true
          }}
          onPageChange={this.handlePageChange}
          onRowsPerPageChange={this.handleRowsPerPageChange}
          ActionsComponent={ResultTablePaginationActions}
          sx={theme => ({
            display: 'flex',
            backgroundColor: '#fff',
            borderTop: '1px solid rgba(224, 224, 224, 1);',
            alignItems: 'center',
            '& .MuiTablePagination-toolbar': {
              '& p': {
                fontSize: '0.75rem',
                marginTop: 0,
                marginBottom: 0
              },
              minHeight: this.props.layoutConfig.paginationToolbarHeight,
              [theme.breakpoints.down('sm')]: {
                display: 'flex',
                flexWrap: 'wrap',
                marginTop: theme.spacing(0.5)
              }
            },
            '& .MuiTablePagination-displayedRows': {
              minWidth: 110
            }
          })}
        />
        <div className={classes.tableContainer}>
          {fetching
            ? (
              <div className={classes.progressContainer}>
                <CircularProgress />
              </div>
              )
            : (
              <Table size='small'>
                <ResultTableHead
                  perspectiveConfig={this.props.perspectiveConfig}
                  resultClass={this.props.resultClass}
                  columns={this.props.data.properties}
                  onSortBy={this.handleSortBy}
                  sortBy={sortBy}
                  sortDirection={sortDirection}
                />
                <TableBody>
                  {paginatedResults.map(row => this.rowRenderer(row))}
                </TableBody>
              </Table>
              )}
        </div>
      </>
    )
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  facetUpdateID: PropTypes.number.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  updateRowsPerPage: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired,
  rootUrl: PropTypes.string.isRequired,
  currentLocale: PropTypes.string.isRequired
}

export const ResultTableComponent = ResultTable

export default withStyles(styles)(ResultTable)
