import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import ResultTablePaginationActions from './ResultTablePaginationActions';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
// import InfoIcon from '@material-ui/icons/InfoOutlined';


const styles = () => ({
  paginationRow: {
    //borderBottom: '1px solid lightgrey'
  },
  paginationRoot: {
    display: 'flex',
    justifyContent: 'flex-start',
  }
});

const columns = [
  {
    label: 'Source',
    property: 'source',
    desc: 'Source description',
    //filter: true
  },
  {
    label: 'Title',
    property: 'prefLabel',
    desc: 'Title description'
  },
  {
    label: 'Author',
    property: 'author',
    desc: 'Author description',
    //filter: true
  },
  {
    label: 'Production place',
    property: 'productionPlace',
    desc: 'Production place description',
    filter: true
  },
  {
    label: 'Production date',
    property: 'productionTimespan',
    desc: 'Production date description'
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
    label: 'Event',
    property: 'event',
    desc: 'Event description'
  },
  {
    label: 'Owner',
    property: 'owner',
    desc: 'Material description'
  },
];


class ResultTableHead extends React.Component {

  // handleChangeRowsPerPage = event => {
  //   this.setState({ rowsPerPage: event.target.value });
  // };
  //
  // handleRequestSort  = property => () => {
  //   const orderBy = property;
  //   let order = 'desc';
  //   if (this.state.orderBy === property && this.state.order === 'desc') {
  //     order = 'asc';
  //   }
  //   this.setState({ order, orderBy });
  // };

  render() {
    const { classes, page, resultCount, pagesize, sortBy, sortDirection } = this.props;

    return (
      <TableHead>
        <TableRow className={classes.paginationRow}>
          <TablePagination
            count={resultCount}
            rowsPerPage={pagesize}
            rowsPerPageOptions={[5]}
            page={page}
            onChangePage={this.props.onChangePage}
            onChangeRowsPerPage={this.props.onChangeRowsPerPage}
            ActionsComponent={ResultTablePaginationActions}
            classes={{root: classes.paginationRoot}}
          />
        </TableRow>
        <TableRow>
          {columns.map(column => {
            return (
              <TableCell
                key={column.property}
                sortDirection={sortBy === column.property ? sortDirection : false}
              >
                <Tooltip
                  title="Sort"
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={sortBy === column.property}
                    direction={sortDirection}
                    onClick={this.props.onSortBy(column.property)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
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
  onChangePage: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  resultCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pagesize: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  routeProps: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultTableHead);
