import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import FacetDialog from './FacetDialog';
import TablePagination from '@material-ui/core/TablePagination';
import ResultTablePaginationActions from './ResultTablePaginationActions';
// import InfoIcon from '@material-ui/icons/InfoOutlined';
// import TableSortLabel from '@material-ui/core/TableSortLabel';

const styles = () => ({
  paginationRow: {
    borderBottom: '1px solid lightgrey'
  },
  paginationRoot: {
    display: 'flex',
    justifyContent: 'flex-start'
  }
});

const columns = [
  {
    label: 'ID',
    property: 'id',
    desc: 'ID description'
  },
  {
    label: 'Title',
    property: 'prefLabel',
    desc: 'Title description'
  },
  {
    label: 'Author',
    property: 'author',
    desc: 'Author description'
  },
  {
    label: 'Creation place',
    property: 'creationPlace',
    desc: 'Creation place description',
    filter: true
  },
  {
    label: 'Creation date',
    property: 'timespan',
    desc: 'Creation date description'
  },
  {
    label: 'Language',
    property: 'language',
    desc: 'Language description'
  },
  // {
  //   label: 'Material',
  //   property: 'material',
  //   desc: 'Material description'
  // },
  {
    label: 'Observation',
    property: 'observation',
    desc: 'Observation description'
  },
  {
    label: 'Owner',
    property: 'owner',
    desc: 'Material description'
  },
];


class ResultTableHead extends React.Component {
  state = {
    rowsPerPage: 5,
    order: 'asc',
    orderBy: 'creationPlace',
  };

  handleChangePage = (event, page) => {
    // console.log(page)
    this.props.fetchManuscripts(page);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleRequestSort  = property => () => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  // <TableSortLabel
  //   active={orderBy === column.property}
  //   direction={order}
  //   onClick={this.handleRequestSort(column.property)}
  // >
  //   {column.label}
  // </TableSortLabel>

  render() {
    const { classes, page, results } = this.props;
    const { rowsPerPage } = this.state;
    //order, orderBy

    return (
      <TableHead>
        <TableRow className={classes.paginationRow}>
          <TablePagination
            count={results}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5]}
            page={page}
            onChangePage={this.handleChangePage}
            onChangeRowsPerPage={this.handleChangeRowsPerPage}
            ActionsComponent={ResultTablePaginationActions}
            classes={{root: classes.paginationRoot}}
          />
        </TableRow>
        <TableRow>
          {columns.map(column => {
            return (
              <TableCell
                key={column.property}
              >
                {column.label}
                {column.filter &&
                  <Tooltip title={'Filter ' + column.label}>
                    <FacetDialog
                      property={column.property}
                      propertyLabel={column.label}
                      fetchFacet={this.props.fetchFacet}
                      updateFilter={this.props.updateFilter}
                      facet={this.props.facet} />
                  </Tooltip>}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }
}

ResultTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired,
  results: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired
};

export default withStyles(styles)(ResultTableHead);
