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
import TableHead from '@material-ui/core/TableHead';
import Tooltip from '@material-ui/core/Tooltip';
import FacetDialog from './FacetDialog';
import ResultTablePaginationActions from './ResultTablePaginationActions';
import { has, orderBy } from 'lodash';

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
    overflow: 'auto',
  },
  paginationRow: {
    borderBottom: '1px solid lightgrey'
  },
  valueList: {
    paddingLeft: 15
  },
  withFilter: {
    minWidth: 170
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
    desc: 'Title description',
    filter: false
  },
  {
    label: 'Author',
    property: 'author',
    desc: 'Author description',
    filter: false
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
    desc: 'Creation date description',
    filter: false
  },
  {
    label: 'Language',
    property: 'language',
    desc: 'Language description',
    filter: false
  },
  {
    label: 'Material',
    property: 'material',
    desc: 'Material description',
    filter: false
  },
  {
    label: 'Owner',
    property: 'owner',
    desc: 'Former or current owner description',
    filter: false
  },
];

class ResultTable extends React.Component {
  state = {
    rowsPerPage: 5,
  };

  handleChangePage = (event, page) => {
    //console.log(page)
    this.props.fetchManuscripts(page);
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  idRenderer = (row) => {
    let sdbmLink = '';
    let id = row.id.replace('http://ldf.fi/mmm/manifestation_singleton/', '');
    if (has(row, 'manuscriptRecord') && row.manuscriptRecord !== '-') {
      sdbmLink = row.manuscriptRecord;
    } else {
      sdbmLink = row.entry;
      id = id.replace('orphan_', '');
    }
    id = id.replace('part_', '');
    return (
      <div className={this.props.classes.tableColumn}>
        <a target='_blank' rel='noopener noreferrer' href={sdbmLink}>{id}</a>
      </div>
    );
  };

  stringListRenderer = (cell) => {
    if (Array.isArray(cell)) {
      cell = cell.sort();
      return (
        <ul className={this.props.classes.valueList}>
          {cell.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    } else {
      return <span>{cell}</span>;
    }
  };

  objectListRenderer = (cell, makeLink, customSort, ordered) => {
    if (cell == null || cell === '-'){
      return '-';
    }
    else if (Array.isArray(cell)) {
      if (customSort) {
        cell.sort((a, b) =>
        {
          if (Array.isArray(a.order)) { a.order = a.order[0]; }
          if (Array.isArray(b.order)) { b.order = b.order[0]; }
          return a.order - b.order;
        });
      } else {
        cell = orderBy(cell, 'prefLabel');
      }
      const listItems = cell.map((item, i) =>
        <li key={i}>
          {makeLink &&
            <a
              target='_blank' rel='noopener noreferrer'
              href={item.sdbmLink}
            >
              {item.prefLabel}
            </a>
          }
          {!makeLink && item.prefLabel}
        </li>
      );
      if (ordered) {
        return (
          <ol className={this.props.classes.valueList}>
            {listItems}
          </ol>
        );
      } else {
        return (
          <ul className={this.props.classes.valueList}>
            {listItems}
          </ul>
        );
      }
    } else if (makeLink) {
      return (
        <a
          target='_blank' rel='noopener noreferrer'
          href={cell.sdbmLink}
        >
          {cell.prefLabel}
        </a>
      );
    } else {
      return (
        <span>{cell.prefLabel}</span>
      );
    }
  };

  render() {
    const { classes, rows, page, results } = this.props;
    const { rowsPerPage } = this.state;

    return (
      <Paper className={classes.root}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
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
                />
              </TableRow>
              <TableRow>
                {columns.map(column => {
                  return (
                    <TableCell key={column.label}>
                      <Tooltip
                        title={column.desc}
                        enterDelay={200}
                      >
                        <span>{column.label}</span>
                      </Tooltip>
                      {column.filter &&
                        <Tooltip title={'Filter ' + column.label}>
                          <FacetDialog
                            property={column.property}
                            propertyLabel={column.label}
                            fetchFacet={this.props.fetchFacet}
                            facet={this.props.facet} />
                        </Tooltip>}
                    </TableCell>
                  );
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row" >
                      {this.idRenderer(row)}
                    </TableCell>
                    <TableCell className={classes.withFilter} >
                      {this.stringListRenderer(row.prefLabel)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.objectListRenderer(row.author, true)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.objectListRenderer(row.creationPlace, true)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.objectListRenderer(row.timespan)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.stringListRenderer(row.language)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.stringListRenderer(row.material)}
                    </TableCell>
                    <TableCell className={classes.withFilter}>
                      {this.objectListRenderer(row.owner, true, true, true)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
            <TableFooter>

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
  facet: PropTypes.object.isRequired,
  results: PropTypes.number.isRequired,
  page: PropTypes.number.isRequired
};

export default withStyles(styles)(ResultTable);
