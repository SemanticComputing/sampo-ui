import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import {
  AutoSizer,
  Column,
  Table,
  SortDirection,
  SortIndicator
} from 'react-virtualized';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 25,
  },
  headerRow: {
    borderBottom: '1px solid #e0e0e0'
  },
  evenRow: {
    borderBottom: '1px solid #e0e0e0'
  },
  oddRow: {
    borderBottom: '1px solid #e0e0e0',
    //backgroundColor: '#fafafa'
  },
  headerColumn: {
    textTransform: 'none'
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

});

class VirtualizedTable extends React.PureComponent {

  constructor(props) {
    super(props);

    const sortBy = 'source';
    const sortDirection = SortDirection.ASC;
    const sortedList = this._sortList({sortBy, sortDirection});


    this.state = {
      disableHeader: false,
      headerHeight: 30,
      height: 500,
      overscanRowCount: 10,
      rowHeight: 40,
      rowCount: this.props.list.size,
      scrollToIndex: undefined,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight: false,
    };

    this._getRowHeight = this._getRowHeight.bind(this);
    this._headerRenderer = this._headerRenderer.bind(this);
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._onRowCountChange = this._onRowCountChange.bind(this);
    this._onScrollToRowChange = this._onScrollToRowChange.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const {
      disableHeader,
      headerHeight,
      height,
      overscanRowCount,
      rowHeight,
      rowCount,
      scrollToIndex,
      sortBy,
      sortDirection,
      sortedList,
      useDynamicRowHeight,
    } = this.state;

    const { classes } = this.props;

    const rowGetter = ({index}) => this._getDatum(sortedList, index);

    return (
      <div>
        <AutoSizer>
          {({width}) => (
            <Table
              disableHeader={disableHeader}
              headerClassName={classes.headerColumn}
              headerHeight={headerHeight}
              height={height}
              noRowsRenderer={this._noRowsRenderer}
              overscanRowCount={overscanRowCount}
              rowClassName={this._rowClassName}
              rowHeight={useDynamicRowHeight ? this._getRowHeight : rowHeight}
              rowGetter={rowGetter}
              rowCount={rowCount}
              scrollToIndex={scrollToIndex}
              sort={this._sort}
              sortBy={sortBy}
              sortDirection={sortDirection}
              width={width}
              style={classes}
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

  _headerRenderer({dataKey, sortBy, sortDirection}) {
    return (
      <div>
        Full Name
        {sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
      </div>
    );
  }

  _noRowsRenderer() {
    const { classes } = this.props;
    return <div className={classes.noRows}>No rows</div>;
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

  _rowClassName({index}) {
    const { classes } = this.props;
    if (index < 0) {
      return classes.headerRow;
    } else {
      return index % 2 === 0 ? classes.evenRow : classes.oddRow;
    }
  }

  _sort({sortBy, sortDirection}) {
    const sortedList = this._sortList({sortBy, sortDirection});

    this.setState({sortBy, sortDirection, sortedList});
  }

  _sortList({sortBy, sortDirection}) {
    const list = this.props.list;

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
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(VirtualizedTable);
