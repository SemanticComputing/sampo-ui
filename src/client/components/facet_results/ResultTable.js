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
import history from '../../History';

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
      page = this.props.data.page === -1 ? 0 : this.props.data.page;
      // console.log(`result table mounted WITHOUT page parameter, set page to ${page}`);
    } else {
      page = parseInt(parse(this.props.routeProps.location.search).page);
      // console.log(`result table mounted with page parameter, set page to ${page}`);
    }
    this.props.updatePage(this.props.resultClass, page);
    history.push({
      pathname: `/${this.props.resultClass}/table`,
      search: `?page=${page}`,
    });
  }

  componentDidUpdate = prevProps => {
    if (prevProps.data.page != this.props.data.page) {
      this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy, this.props.variant);
      history.push({
        pathname: `/${this.props.resultClass}/table`,
        search: `?page=${this.props.data.page}`,
      });
    }
    if (prevProps.filters != this.props.filters) {
      this.props.updatePage(this.props.resultClass, 0);
      // if already on page 0, fetch results
      if (this.props.data.page == 0) {
        this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy, this.props.variant);
      }
    }
    if (prevProps.data.sortBy != this.props.data.sortBy) {
      this.props.updatePage(this.props.resultClass, 0);
      if (this.props.data.page == 0) {
        this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy, this.props.variant);
      }
    }
    if (prevProps.data.sortDirection != this.props.data.sortDirection) {
      this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy, this.props.variant);
    }
  }

  handleChangePage = (event, page) => {
    if (event != null) {
      this.props.updatePage(this.props.resultClass, page);
    }
  }

  handleOnChangeRowsPerPage = (event, rowsPerPage) => {
    if (event != null) {
      return rowsPerPage;
    }
  }

  handleSortBy = sortBy => event => {
    if (event != null) {
      this.props.sortResults(this.props.resultClass, sortBy);
    }
  }

  rowRenderer = row => {
    return (
      <TableRow key={row.id}>
        {this.props.data.tableColumns.map(column => {
          return (
            <ResultTableCell
              key={column.id}
              columnId={column.id}
              data={row[column.id] == null ? '-' : row[column.id]}
              valueType={column.valueType}
              makeLink={column.makeLink}
              sortValues={column.sortValues}
              numberedList={column.numberedList}
              minWidth={column.minWidth}
            />
          );
        })}
      </TableRow>
    );
  }

  render() {
    const { classes } = this.props;
    const { resultsCount, paginatedResults, page, pagesize, sortBy, sortDirection, fetching } = this.props.data;
    // console.log(paginatedResults)
    if (fetching) {
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
              columns={this.props.data.tableColumns}
              onChangePage={this.handleChangePage}
              onSortBy={this.handleSortBy}
              onChangeRowsPerPage={this.handleOnChangeRowsPerPage}
              resultsCount={resultsCount}
              page={page}
              pagesize={pagesize}
              sortBy={sortBy}
              sortDirection={sortDirection}
              routeProps={this.props.routeProps}
            />
            <TableBody>
              {paginatedResults.map(row => this.rowRenderer(row))}
            </TableBody>
          </Table>
        </div>
      );
    }
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  variant: PropTypes.string,
  filters: PropTypes.object.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultTable);
