import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Paper from '@material-ui/core/Paper';
import ResultTableHead from './ResultTableHead';
import ResultTablePaginationActions from './ResultTablePaginationActions';

const styles = () => ({
  root: {
    width: '100%',
    //marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  valueList: {
    paddingLeft: 15
  },
  withFilter: {
    minWidth: 200
  }
});

class ResultTable extends React.Component {
  state = {
    page: 0,
    rowsPerPage: 5,
  };

  handleChangePage = (event, page) => {
    this.props.fetchManuscripts(page + 1);
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  idRenderer = (row) => {
    let cell = row.id.replace('http://ldf.fi/mmm/manifestation_singleton/', '');
    let sdbmUrl = '';
    let id = '';
    if (row.manuscriptRecord == '-') {
      id = cell.replace('orphan_', '');
      sdbmUrl = 'https://sdbm.library.upenn.edu/entries/' + id;
    } else {
      id = cell;
      sdbmUrl = row.manuscriptRecord;
    }
    id = id.replace('part_', '');
    return (
      <div className={this.props.classes.tableColumn}>
        <a target='_blank' rel='noopener noreferrer' href={sdbmUrl}>{id}</a>
      </div>
    );
  };

  stringListRenderer = (cell) => {
    if (Array.isArray(cell)) {
      return (
        <ul className={this.props.classes.valueList}>
          {cell.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    } else {
      return <span>{cell}</span>;
    }
  };

  objectListRenderer = (cell) => {
    if (cell == null){
      return '-';
    }
    else if (Array.isArray(cell)) {
      return (
        <ul className={this.props.classes.valueList}>
          {cell.map((item, i) =>
            <li key={i}>
              <a
                target='_blank' rel='noopener noreferrer'
                href={item.sdbmLink}
              >
                {item.prefLabel}
              </a>
            </li>
          )}
        </ul>
      );
    } else {
      return (
        <a
          target='_blank' rel='noopener noreferrer'
          href={cell.sdbmLink}
        >
          {cell.prefLabel}
        </a>
      );
    }
  };

  render() {
    const { classes, rows } = this.props;
    const { rowsPerPage, page } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <ResultTableHead
              facet={this.props.facet}
              fetchFacet={this.props.fetchFacet}
            />
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row">
                      {this.idRenderer(row)}
                    </TableCell>
                    <TableCell>
                      {this.stringListRenderer(row.prefLabel)}
                    </TableCell>
                    <TableCell>
                      {this.objectListRenderer(row.author)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.objectListRenderer(row.creationPlace)}
                    </TableCell>
                    <TableCell>
                      {this.objectListRenderer(row.timespan)}
                    </TableCell>
                    <TableCell>
                      {this.stringListRenderer(row.language)}
                    </TableCell>
                    <TableCell>
                      {this.stringListRenderer(row.material)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  ActionsComponent={ResultTablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>
    );
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultTable);
