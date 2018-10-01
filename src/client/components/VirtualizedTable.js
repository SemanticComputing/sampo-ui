import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
// import ResultFilterDialogSingle from './ResultFilterDialogSingle';
// import IconButton from '@material-ui/core/IconButton';
// import PlaceIcon from '@material-ui/icons/Place';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  Column,
  Table,
  //SortIndicator
} from 'react-virtualized';

// https://github.com/bvaughn/react-virtualized/issues/650
// https://github.com/bvaughn/react-virtualized/blob/master/docs/usingAutoSizer.md

const styles = () => ({
  root: {
    display: 'flex',
    height: '100%',
    flexGrow: 1,
  },
  container: {
    height: '100%',
    width: '100%',
    flexDirection: 'column'
  },
  tableColumn: {
    padding: '5px 15px 5px 0'
  },
  valueList: {
    marginTop: 0,
    marginBottom: 0,
  }
});

const tableStyles = {
  tableRoot: {
    fontFamily: 'Roboto',
  },
  headerRow: {
    textTransform: 'none',
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
  tableRow: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
};

class VirtualizedTable extends React.PureComponent {

  constructor(props) {
    super(props);
  }

  cache = new CellMeasurerCache({
    fixedWidth: true,
    minHeight: 40,
  });

  columnCellRenderer = ({dataKey, parent, rowIndex}) => {
    const {list} = this.props;
    const rowData = list.get(rowIndex % list.size);
    const cellData = rowData[dataKey];
    let cellContent = '';
    if (cellData == null | cellData === '-') {
      cellContent = '-';
    } else {
      switch(dataKey) {
        case 'prefLabel':
          cellContent = this.stringListRenderer(cellData);
          break;
        case 'author':
          cellContent = this.objectListRenderer(cellData);
          break;
      }
    }

    return (
      <CellMeasurer
        cache={this.cache}
        columnIndex={0}
        key={dataKey}
        parent={parent}
        rowIndex={rowIndex}>
        <div
          className={this.props.classes.tableColumn}
          style={{
            whiteSpace: 'normal',
          }}>
          {cellContent}
        </div>
      </CellMeasurer>
    );

  };

  idRenderer = ({dataKey, parent, rowIndex}) => {
    const {list} = this.props;
    const rowData = list.get(rowIndex % list.size);
    let cellData = rowData[dataKey];
    cellData = cellData.replace('http://ldf.fi/mmm/manifestation_singleton/', '');
    let sdbmUrl = '';
    let id = '';
    if (rowData.manuscriptRecord == '-') {
      id = cellData.replace('orphan_', '');
      sdbmUrl = 'https://sdbm.library.upenn.edu/entries/' + id;
    } else {
      id = cellData;
      sdbmUrl = rowData.manuscriptRecord;
    }
    id = id.replace('part_', '');
    return (
      <div className={this.props.classes.tableColumn}>
        <a target='_blank' rel='noopener noreferrer' href={sdbmUrl}>{id}</a>
      </div>
    );
  };

  objectListRenderer = (cellData) => {
    return (
      <ul className={this.props.classes.valueList}>
        {cellData.map((item, i) =>
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
  };

  stringListRenderer = (cellData) => {
    return (
      <ul className={this.props.classes.valueList}>
        {cellData.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    );
  };

  rowGetter = ({index}) => this.getDatum(this.props.list, index);

  getDatum = (list, index) => {
    return list.get(index % list.size);
  }

  calculateRowStyle = ({ index }) => {
    if (index < 0) {
      return tableStyles.headerRow;
    } else {
      return tableStyles.tableRow;
    }
  };

  // <Column
  //   label="Creation place"
  //   dataKey="creationPlace"
  //   cellRenderer={this.columnCellRenderer}
  //   width={300}
  // />

  //


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container className={classes.container}>
          <div className={classes.resultsInfo}>
          </div>
          {this.props.list.size > 0 &&
            <div style={{ flex: '1 1 auto' }}>
              <AutoSizer>
                {({ height, width }) => (
                  <Table
                    deferredMeasurementCache={this.cache}
                    rowHeight={this.cache.rowHeight}
                    overscanRowCount={10}
                    rowClassName={'tableRow'}
                    rowGetter={this.rowGetter}
                    rowCount={this.props.list.size}
                    sortDirection={this.props.search.sortDirection.toUpperCase()}
                    width={width}
                    height={height}
                    headerHeight={50}
                    style={tableStyles.tableRoot}
                    rowStyle={this.calculateRowStyle}
                  >
                    <Column
                      label="ID"
                      dataKey="id"
                      cellRenderer={this.idRenderer}
                      width={70}
                    />
                    <Column
                      label="Title"
                      dataKey="prefLabel"
                      cellRenderer={this.columnCellRenderer}
                      width={400}
                    />
                    <Column
                      label="Author"
                      dataKey="author"
                      cellRenderer={this.columnCellRenderer}
                      width={400}
                    />
                  </Table>
                )}
              </AutoSizer>
            </div>
          }
        </Grid>
      </div>
    );
  }
}

VirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  search: PropTypes.object.isRequired,
  manuscriptsPropertyValues: PropTypes.object.isRequired,
  sortResults: PropTypes.func.isRequired,
  updateResultsFilter: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchManuscripts: PropTypes.func.isRequired,
  fetchPlaces: PropTypes.func.isRequired,
  clearManuscripts: PropTypes.func.isRequired,
  clearPlaces: PropTypes.func.isRequired,
  bounceMarker: PropTypes.func.isRequired,
  openMarkerPopup: PropTypes.func.isRequired,
  removeTempMarker: PropTypes.func.isRequired,
};

export default withStyles(styles)(VirtualizedTable);
