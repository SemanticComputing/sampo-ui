import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import ResultTableHead from './ResultTableHead';
import { orderBy } from 'lodash';
import { parse } from 'query-string';

const styles = (theme) => ({
  tableContainer: {
    marginTop: 72,
    overflow: 'auto',
    width: '100% - 8px'
  },
  table: {
    //marginTop: 72,
    minWidth: 700,
    //overflowX: 'auto',
    backgroundColor: theme.palette.background.paper
  },
  paginationRow: {
    borderBottom: '1px solid lightgrey'
  },
  valueList: {
    paddingLeft: 15
  },
  valueListNoBullets: {
    listStyle: 'none',
    paddingLeft: 0
  },
  withFilter: {
    minWidth: 170
  },
  infoIcon: {
    paddingTop: 15
  },
  progressContainer: {
    width: '100%',
    height: '100%',
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
      page = this.props.page === -1 ? 0 : this.props.page;
      this.props.routeProps.history.push({
        pathname: '/manuscripts/table',
        search: `?page=${page}`,
      });
    } else {
      page = parseInt(parse(this.props.routeProps.location.search).page);
    }
    this.props.updatePage(page);
    this.props.fetchManuscripts();
    this.props.fetchFacet();
  }

  componentDidUpdate = prevProps => {
    if (prevProps.page != this.props.page) {
      this.props.routeProps.history.push({
        pathname: '/manuscripts/table',
        search: `?page=${this.props.page}`,
      });
    }
  }

  idRenderer = id => {
    const plainId = id.substring(id.lastIndexOf('/') + 1);
    return (
      <div className={this.props.classes.tableColumn}>
        <a target='_blank' rel='noopener noreferrer' href={id}>{plainId}</a>
      </div>
    );
  };

  stringListRenderer = cell => {
    if (cell == null || cell === '-'){
      return '-';
    }
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

  objectListRenderer = (cell, makeLink, ordered) => {
    if (cell == null || cell === '-'){
      return '-';
    }
    else if (Array.isArray(cell)) {
      cell = orderBy(cell, 'prefLabel');
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

  eventRenderer = cell => {
    if (Array.isArray(cell)) {
      cell = orderBy(cell, 'date');
      const items = cell.map((item, i) => {
        return (
          <li key={i}>
            {item.date == null ? <span className={this.props.classes.noDate}>No date</span> : item.date}
            {' '}
            <a
              target='_blank' rel='noopener noreferrer'
              href={item.dataProviderUrl}
            >
              {item.type === 'http://www.cidoc-crm.org/cidoc-crm/E8_Acquisition' ? 'Acquisition' : 'Observation'}
            </a>
          </li>
        );
      });
      return (
        <ul className={this.props.classes.valueList}>
          {items}
        </ul>
      );
    } else {
      return (
        <span>
          {cell.date == null ? <span className={this.props.classes.noDate}>No date</span> : cell.date}
          {' '}
          <a
            target='_blank' rel='noopener noreferrer'
            href={cell.dataProviderUrl}
          >
            {cell.type === 'http://www.cidoc-crm.org/cidoc-crm/E8_Acquisition' ? 'Acquisition' : 'Observation'}
          </a>
        </span>

      );
    }
  };

  ownerRenderer = cell => {
    if (cell == null || cell === '-'){
      return '-';
    }
    if (Array.isArray(cell)) {
      cell.map(item => {
        Array.isArray(item.order) ? item.earliestOrder = item.order[0] : item.earliestOrder = item.order;
      });
      cell.sort((a, b) => a.earliestOrder - b.earliestOrder);

      const items = cell.map((item, i) => {
        return (
          <li key={i}>
            <span>{Array.isArray(item.order) ? item.order.toString() : item.order}. </span>
            <a
              target='_blank' rel='noopener noreferrer'
              href={item.sdbmLink}
            >
              {item.prefLabel}
            </a>
          </li>
        );
      });
      return (
        <ul className={this.props.classes.valueListNoBullets}>
          {items}
        </ul>
      );
    } else {
      return (
        <span>{cell.date}<br />{cell.location}</span>
      );
    }
  };

  render() {
    const { classes, rows } = this.props;
    // console.log(rows)

    if (this.props.fetchingManuscripts   ) {
      return (
        <Paper className={classes.progressContainer}>
          <Typography className={classes.progressTitle} variant="h4" color='primary'>Fetching manuscript data</Typography>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </Paper>
      );
    } else {
      return (
        <div className={classes.tableContainer}>
          <Table className={classes.table}>
            <ResultTableHead
              fetchFacet={this.props.fetchFacet}
              fetchManuscripts={this.props.fetchManuscripts}
              fetchPlaces={this.props.fetchPlaces}
              updateFilter={this.props.updateFilter}
              updatePage={this.props.updatePage}
              facet={this.props.facet}
              resultCount={this.props.resultCount}
              page={this.props.page}
              routeProps={this.props.routeProps}
            />
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow key={row.id}>
                    <TableCell component="th" scope="row" >
                      {this.idRenderer(row.dataProviderUrl)}
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
                    {/*<TableCell className={classes.withFilter}>
                          {this.stringListRenderer(row.material)}
                        </TableCell>*/}
                    <TableCell className={classes.withFilter}>
                      {this.eventRenderer(row.event)}
                    </TableCell>
                    {/* <TableCell className={classes.withFilter}>
                      {this.ownerRenderer(row.owner)}
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      );
    }
  }
}

ResultTable.propTypes = {
  classes: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  fetchingManuscripts: PropTypes.bool.isRequired,
  facet: PropTypes.object.isRequired,
  resultCount: PropTypes.number.isRequired,
  updateFilter: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  updatePage: PropTypes.func.isRequired,
  routeProps: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultTable);
