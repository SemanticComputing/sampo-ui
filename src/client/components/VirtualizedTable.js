import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import SearchField from '../components/SearchField';
import ResultFilterDialogSingle from './ResultFilterDialogSingle';
import IconButton from '@material-ui/core/IconButton';
import PlaceIcon from '@material-ui/icons/Place';
import {
  AutoSizer,
  Column,
  Table,
  SortIndicator
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
  resultsInfo: {
    flexGrow: 0
  },
  searchField: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 70
  },
});

const tableStyles = {
  tableRoot: {
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

const columnWidth = 200;

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
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const { classes, list } = this.props;
    const rowGetter = ({index}) => this._getDatum(list, index);

    const idRenderer = ({cellData, rowData}) => {
      if (cellData == null) return '';
      let sdbmUrl = '';
      if (rowData.sdbmId) {
        sdbmUrl = 'https://sdbm.library.upenn.edu/manuscripts/';
      } else {
        sdbmUrl = 'https://sdbm.library.upenn.edu/entries/';
      }
      const idLink = <a target='_blank' rel='noopener noreferrer' href={sdbmUrl + cellData}>{cellData}</a>;
      return (
        <div key={cellData}>
          {idLink}
        </div>
      );
    };

    const valueFromArray = (property, rowData) => {
      if (rowData[property] === '-') {
        return rowData[property];
      } else {
        return rowData[property].map((item => item.split(';')[1])).join(' | ');
      }
    };


    // sort={this._sort}
    // sortBy={this.props.search.sortBy}

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
                    overscanRowCount={10}
                    rowHeight={40}
                    rowGetter={rowGetter}
                    rowCount={this.props.list.size}

                    sortDirection={this.props.search.sortDirection.toUpperCase()}
                    width={width}
                    height={height}
                    headerHeight={50}
                    noRowsRenderer={this._noRowsRenderer}
                    style={tableStyles.tableRoot}
                    rowStyle={calculateRowStyle}
                  >
                    <Column
                      label="ID"
                      cellDataGetter={({rowData}) => rowData.id.replace('http://ldf.fi/mmm/manifestation_singleton/', '')}
                      dataKey="id"
                      cellRenderer={idRenderer}
                      width={70}
                    />
                    <Column
                      label="Title"
                      cellDataGetter={({rowData}) => rowData.prefLabel}
                      dataKey="prefLabel"

                      width={300}
                    />
                    <Column
                      label="Author"
                      cellDataGetter={({rowData}) => valueFromArray('author', rowData)}
                      dataKey="author"

                      width={300}
                    />
                    <Column
                      label="Creation place"
                      cellDataGetter={({rowData}) => valueFromArray('creationPlace', rowData)}
                      dataKey="creationPlace"

                      width={300}
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


  // _onScrollToRowChange(event) {
  //   const {rowCount} = this.state;
  //   let scrollToIndex = Math.min(
  //     rowCount - 1,
  //     parseInt(event.target.value, 10),
  //   );
  //
  //   if (isNaN(scrollToIndex)) {
  //     scrollToIndex = undefined;
  //   }
  //
  //   this.setState({scrollToIndex});
  // }

  // https://stackoverflow.com/questions/40412114/how-to-do-proper-column-filtering-with-react-virtualized-advice-needed
  _sort({ event, sortBy, sortDirection }) {
    // console.log(event.target)
    if (event.target.id.startsWith('filter') || event.target.className.startsWith('Mui')) {
      event.stopPropagation();
    } else {
      this.props.sortResults({ sortBy, sortDirection: sortDirection.toLowerCase() });
    }
  }
}

VirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  search: PropTypes.object.isRequired,
  resultValues: PropTypes.object.isRequired,
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
