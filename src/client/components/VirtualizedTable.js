import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import {
  AutoSizer,
  Column,
  Table,
  SortDirection,
} from 'react-virtualized';
// import styles from '../styles/react-virtualized-table.css';
//import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    marginTop: 25,
    fontFamily: 'Roboto',
  },
  headerRow: {
    textTransform: 'none',
    borderBottom: '1px solid rgba(224, 224, 224, 1)'
  },
  evenRow: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    //backgroundColor: '#fafafa'
  },
  oddRow: {
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  noRows: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1em',
    color: '#bdbdbd',
  }
};

const calculateRowStyle = ({ index }) => {
  if (index < 0) {
    return styles.headerRow;
  } else {
    return index % 2 === 0 ? styles.evenRow : styles.oddRow;
  }
};

class VirtualizedTable extends React.PureComponent {

  constructor(props) {
    super(props);

    const sortBy = 'typeLabel';
    const sortDirection = SortDirection.ASC;
    const sortedList = this._sortList({sortBy, sortDirection});

    this.state = {
      headerHeight: 30,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: this.props.list.size,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight: false,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const {
      headerHeight,
      overscanRowCount,
      rowHeight,
      rowCount,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight,
    } = this.state;

    const rowGetter = ({index}) => this._getDatum(sortedList, index);

    return (
      <div style={{ flex: '1 1 auto' }}>
        <AutoSizer>
          {({ height, width }) => (
            <Table
              overscanRowCount={overscanRowCount}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowGetter={rowGetter}
              rowCount={rowCount}
              sort={this._sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
              height={height}
              headerHeight={headerHeight}
              noRowsRenderer={this._noRowsRenderer}
              style={styles.root}
              rowStyle={calculateRowStyle}
            >
              <Column
                label="Label"
                cellDataGetter={({rowData}) => rowData.label}
                dataKey="label"
                width={150}
              />
              <Column
                label="Type"
                cellDataGetter={({rowData}) => rowData.typeLabel}
                dataKey="typeLabel"
                width={150}
              />
              <Column
                label="Area"
                cellDataGetter={({rowData}) => rowData.broaderAreaLabel}
                dataKey="broaderAreaLabel"
                width={150}
              />
              <Column
                label="Source"
                cellDataGetter={({rowData}) => rowData.source}
                dataKey="source"
                width={150}
              />
            </Table>
          )}
        </AutoSizer>
      </div>
    );
  }

  _getDatum(list, index) {
    return list.get(index % list.size);
  }

  _getRowHeight({index}) {
    const list = this.props.list;

    return this._getDatum(list, index).size;
  }

  _noRowsRenderer() {
    return <div className={styles.noRows}>No rows</div>;
  }

  _onRowCountChange(event) {
    const rowCount = parseInt(event.target.value, 10) || 0;

    this.setState({rowCount});
  }

  _onScrollToRowChange(event) {
    const {rowCount} = this.state;
    let scrollToIndex = Math.min(
      rowCount - 1,
      parseInt(event.target.value, 10),
    );

    if (isNaN(scrollToIndex)) {
      scrollToIndex = undefined;
    }

    this.setState({scrollToIndex});
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({sortBy, sortDirection}) {
    const list = this.props.list;
    //console.log(list);
    //console.log(list.sortBy(item => item[sortBy]));

    return list
      .sortBy(item => item[sortBy])
      .update(
        list => (sortDirection === SortDirection.DESC ? list.reverse() : list),
      );
  }

  _updateUseDynamicRowHeight(value) {
    this.setState({
      useDynamicRowHeight: value,
    });
  }
}

VirtualizedTable.propTypes = {
  list: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default VirtualizedTable;
