import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import MaterialTableFacetResultsHead from './MaterialTableFacetResultsHead';
import ResultTableCell from './ResultTableCell';
import TablePagination from '@material-ui/core/TablePagination';
import ResultTablePaginationActions from './ResultTablePaginationActions';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import querystring from 'querystring';
import history from '../../History';

const styles = () => ({
  paginationRoot: {
    backgroundColor: '#fff',
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    borderTop: '1px solid rgba(224, 224, 224, 1);'
  }
});

class MaterialTableFacetResults extends React.Component {

  componentDidMount = () => {
    let page;
    if (this.props.routeProps.location.search === '') {
      page = this.props.data.page === -1 ? 0 : this.props.data.page;
      // console.log(`result table mounted WITHOUT page parameter, set page to ${page}`);
    } else {

      const qs = this.props.routeProps.location.search.replace('?', '');
      page = parseInt(querystring.parse(qs).page);
      // console.log(`result table mounted with page parameter, set page to ${page}`);
    }
    this.props.updatePage(this.props.resultClass, page);
    history.push({
      pathname: `/${this.props.resultClass}/table`,
      search: `?page=${page}`,
    });
    if (this.props.data.resultsUpdateID !== -1 && this.props.data.resultsUpdateID !== this.props.facetUpdateID) {
      this.props.updatePage(this.props.resultClass, 0);
      this.fetchResults();
    }
  }

  componentDidUpdate = prevProps => {
    // always fetch new results when page has updated
    if (prevProps.data.page != this.props.data.page) {
      this.fetchResults();
      history.push({
        pathname: `/${this.props.resultClass}/table`,
        search: `?page=${this.props.data.page}`,
      });
    }
    // when sort property or direction changes, return to first page
    if (this.needNewResults(prevProps)) {
      if (this.props.data.page == 0) {
        this.fetchResults();
      } else {
        this.props.updatePage(this.props.resultClass, 0);
      }
    }
  }

  fetchResults = () => {
    this.props.fetchPaginatedResults(this.props.resultClass, this.props.facetClass, this.props.data.sortBy, this.props.variant);
  }

  needNewResults = prevProps => {
    return (
      prevProps.data.sortBy != this.props.data.sortBy
      || prevProps.data.sortDirection != this.props.data.sortDirection
      || prevProps.facetUpdateID != this.props.facetUpdateID
    );
  }

  handleChangePage = (event, page) => {
    if (event != null && !this.props.data.fetching) {
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

  createColumns = () => {
    const columns = this.props.data.tableColumns.map(column => {
      return {
        title: column.label,
        field: column.id,
        cellStyle: {
          minWidth: column.minWidth,
        },
        render: rowData =>
          <ResultTableCell
            key={column.id}
            columnId={column.id}
            data={rowData[column.id] == null ? '-' : rowData[column.id]}
            valueType={column.valueType}
            makeLink={column.makeLink}
            sortValues={column.sortValues}
            numberedList={column.numberedList}
            minWidth={column.minWidth}
            container='div'
          />
      };
    });
    return columns;
  }

  createDetailPanel = rowData => {
    return(
      <div className={this.props.classes.detailPanelContainer}>
        {this.props.data.tableColumns.map(column => {
          return (
            <ResultTableCell
              key={column.id}
              columnId={column.id}
              data={rowData[column.id] == null ? '-' : rowData[column.id]}
              valueType={column.valueType}
              makeLink={column.makeLink}
              sortValues={column.sortValues}
              numberedList={column.numberedList}
              minWidth={column.minWidth}
              container='div'
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { classes } = this.props;
    const { resultCount, paginatedResults, page, pagesize, sortBy, sortDirection, fetching } = this.props.data;
    return (
      <React.Fragment>
        <TablePagination
          component='div'
          classes={{
            root: classes.paginationRoot
          }}
          count={resultCount}
          rowsPerPage={pagesize}
          rowsPerPageOptions={[25]}
          page={page}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          ActionsComponent={ResultTablePaginationActions}
        />
        <MaterialTable
          columns={this.createColumns()}
          data={paginatedResults}
          isLoading={fetching}
          onOrderChange={this.handleOrderChange}
          detailPanel={[{
            icon: ChevronRightIcon,
            render: rowData => this.createDetailPanel(rowData)
          }]}
          options={{
            toolbar: false,
            paging: false,
          }}
          style={{
            backgroundColor: '#000',
          }}
          components={{
            Header: () => (
              <MaterialTableFacetResultsHead
                columns={this.props.data.tableColumns}
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
            )
          }}
        />
      </React.Fragment>

    );
  }
}

MaterialTableFacetResults.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
  resultClass: PropTypes.string.isRequired,
  facetClass: PropTypes.string.isRequired,
  variant: PropTypes.string,
  facetUpdateID: PropTypes.number.isRequired,
  fetchPaginatedResults: PropTypes.func.isRequired,
  sortResults: PropTypes.func.isRequired,
  updatePage: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(MaterialTableFacetResults);
