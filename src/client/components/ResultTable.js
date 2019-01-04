import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import ResultTableCell from './ResultTableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import ResultTableHead from './ResultTableHead';
import { parse } from 'query-string';

const styles = () => ({
  tableContainer: {
    overflow: 'auto',
    width: '100%',
    height: 'calc(100% - 72px)'
  },
  paginationRow: {
    borderBottom: '1px solid lightgrey'
  },
  infoIcon: {
    paddingTop: 15
  },
  progressContainer: {
    width: '100%',
    height: 'calc(100% - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTitle: {
    marginRight: 15
  },
  noDate: {
    marginRight: 20
  }
});

class ResultTable extends React.Component {

  componentDidMount = () => {
    let page;
    if (this.props.routeProps.location.search === '') {
      page = this.props.search.page === -1 ? 0 : this.props.search.page;
      this.props.routeProps.history.push({
        pathname: `/${this.props.resultClass}/table`,
        search: `?page=${this.props.search.page}`,
      });
      //console.log(`result table mounted WITHOUT page parameter, set page to ${page}`);
    } else {
      //console.log(this.props.routeProps.location.search)
      page = parseInt(parse(this.props.routeProps.location.search).page);
      // console.log(`result table mounted with page parameter, set page to ${page}`);
    }
    this.props.updatePage(page);
  }

  componentDidUpdate = prevProps => {
    if (prevProps.search.page != this.props.search.page) {
      this.props.fetchResults(this.props.resultClass);
      this.props.routeProps.history.push({
        pathname: `/${this.props.resultClass}/table`,
        search: `?page=${this.props.search.page}`,
      });
    }
    if (prevProps.facetFilters != this.props.facetFilters) {
      this.props.updatePage(0);
      if (this.props.search.page == 0) {
        this.props.fetchResults(this.props.resultClass);
      }
    }
    if (prevProps.search.sortBy != this.props.search.sortBy) {
      this.props.updatePage(0);
      if (this.props.search.page == 0) {
        this.props.fetchResults(this.props.resultClass);
      }
    }
    if (prevProps.search.sortDirection != this.props.search.sortDirection) {
      this.props.fetchResults(this.props.resultClass);
    }
  }

  handleChangePage = (event, page) => {
    if (event != null) {
      this.props.updatePage(page);
    }
  }

  handleOnChangeRowsPerPage = (event, rowsPerPage) => {
    if (event != null) {
      console.log(rowsPerPage)
    }
  }

  handleSortBy = sortBy => event => {
    if (event != null) {
      this.props.sortResults(sortBy);
    }
  }

  rowRenderer = row => {
    //console.log(this.props.columns)
    return (
      <TableRow key={row.id}>
        {this.props.columns.map(column => {
          return (
            <ResultTableCell
              key={column.id}
              data={row[column.id] == null ? '-' : row[column.id]}
              valueType={column.valueType}
              makeLink={column.makeLink}
              sortValues={column.sortValues}
            />
          );
        })}
      </TableRow>
    );
  }

  render() {
    const { classes } = this.props;
    const { resultCount, results, page, pagesize, sortBy, sortDirection, fetchingResults } = this.props.search;

    if (fetchingResults) {
      return (
        <div className={classes.progressContainer}>
          <Typography className={classes.progressTitle} variant="h4" color='primary'>Fetching data</Typography>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      );
    } else {
      return (
        <div className={classes.tableContainer}>
          <Table className={classes.table}>
            <ResultTableHead
              onChangePage={this.handleChangePage}
              onSortBy={this.handleSortBy}
              onChangeRowsPerPage={this.handleOnChangeRowsPerPage}
              resultCount={resultCount}
              page={page}
              pagesize={pagesize}
              sortBy={sortBy}
              sortDirection={sortDirection}
              routeProps={this.props.routeProps}
            />
            <TableBody>
              {results.map(row => this.rowRenderer(row))}
            </TableBody>
          </Table>
        </div>
      );
    }
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  search: PropTypes.object.isRequired,
  facetFilters: PropTypes.object.isRequired,
  fetchResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultTable);
