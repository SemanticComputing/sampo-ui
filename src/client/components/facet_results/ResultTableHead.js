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
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/InfoOutlined';


const styles = () => ({
  paginationRow: {
    //borderBottom: '1px solid lightgrey'
  },
  paginationRoot: {
    display: 'flex',
    justifyContent: 'flex-start',
  }
});

class ResultTableHead extends React.Component {

  // handleChangeRowsPerPage = event => {
  //   this.setState({ rowsPerPage: event.target.value });
  // };
  //
  handleRequestSort = property => () => {
    const orderBy = property;
    let order = 'desc';
    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }
    this.setState({ order, orderBy });
  };

  render() {
    const { classes, page, resultsCount, pagesize, sortBy, sortDirection } = this.props;

    return (
      <TableHead>
        <TableRow className={classes.paginationRow}>
          <TablePagination
            count={resultsCount}
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
          {this.props.columns.map(column => {
            return (
              <TableCell
                key={column.id}
                sortDirection={sortBy === column.id ? sortDirection : false}
              >
                <Tooltip
                  title={`Sort by ${column.label}`}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={sortBy === column.id}
                    direction={sortDirection}
                    hideSortIcon={true}
                    onClick={this.props.onSortBy(column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </Tooltip>
                <Tooltip
                  title={column.desc}
                  enterDelay={300}
                >
                  <IconButton>
                    <InfoIcon />
                  </IconButton>
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
  columns: PropTypes.array.isRequired,
  onChangePage: PropTypes.func.isRequired,
  onSortBy: PropTypes.func.isRequired,
  onChangeRowsPerPage: PropTypes.func.isRequired,
  resultsCount: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired,
  pagesize: PropTypes.number.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  routeProps: PropTypes.object.isRequired,
};

export default withStyles(styles)(ResultTableHead);
