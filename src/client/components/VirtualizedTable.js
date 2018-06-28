import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import {CSVLink} from 'react-csv';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  AutoSizer,
  Column,
  Table,
  SortDirection,
} from 'react-virtualized';

const styles = theme => ({
  root: {
    display: 'flex',
    height: '100%',
    flexGrow: 1,
  },
  container: {
    paddingTop: theme.spacing.unit * 3,
    height: '100%',
    flexDirection: 'column'
  },
  resultsInfo: {
    flexGrow: 0
  },
  resultsInfoPaper: {
    height: 40
  },
});

const tableStyles = {
  tableRoot: {
    fontFamily: 'Roboto',
    paddingTop: 24
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
    return tableStyles.headerRow;
  } else {
    return index % 2 === 0 ? tableStyles.evenRow : tableStyles.oddRow;
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
    const { classes } = this.props;

    //https://github.com/bvaughn/react-virtualized/blob/master/docs/usingAutoSizer.md

    return (
      <div className={classes.root}>
        <Grid container className={classes.container}>
          <div className={classes.resultsInfo}>
            <ExpansionPanel>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Result options</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <CSVLink data={sortedList.toArray()}>Results as CSV</CSVLink>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
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
                  style={tableStyles.tableRoot}
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
        </Grid>
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
    return <div className={tableStyles.noRows}>No rows</div>;
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
  classes: PropTypes.object.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
};

export default withStyles(styles)(VirtualizedTable);
