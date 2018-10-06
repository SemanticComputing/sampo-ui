import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ResultTableHead from './ResultTableHead';

const styles = theme => ({
  root: {
    width: '100%',
    //marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  valueList: {
    paddingLeft: 15
  }
});

class ResultTable extends React.Component {

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
    if (cell.length < 2) {
      return <span>{cell[0]}</span>;
    } else {
      return (
        <ul className={this.props.classes.valueList}>
          {cell.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    }
  };

  objectListRenderer = (cell) => {
    if (cell.length < 2) {
      const item = cell[0];
      return (
        <a
          target='_blank' rel='noopener noreferrer'
          href={'https://sdbm.library.upenn.edu/' + item.sdbmType + '/' + item.id}
        >
          {item.prefLabel}
        </a>
      );
    } else {
      return (
        <ul className={this.props.classes.valueList}>
          {cell.map((item, i) =>
            <li key={i}>
              <a
                target='_blank' rel='noopener noreferrer'
                href={'https://sdbm.library.upenn.edu/' + item.sdbmType + '/' + item.id}
              >
                {item.prefLabel}
              </a>
            </li>
          )}
        </ul>
      );
    }
  };

  render() {
    const { classes, rows } = this.props;
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <ResultTableHead
            facetValues={this.props.facetValues}
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
                  <TableCell>
                    {this.objectListRenderer(row.creationPlace)}
                  </TableCell>
                  <TableCell>
                    {this.stringListRenderer(row.timespan)}
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
        </Table>
      </Paper>
    );
  }


}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facetValues: PropTypes.array.isRequired
};

export default withStyles(styles)(ResultTable);
