import React from 'react';
import Immutable from 'immutable';
import PropTypes from 'prop-types';
import ResultFilterDialog from './ResultFilterDialog';
import {CSVLink} from 'react-csv';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DatasetSelector from '../components/DatasetSelector';
import IntegrationAutosuggest from '../components/IntegrationAutosuggest';
import Button from '@material-ui/core/Button';

import {
  AutoSizer,
  Column,
  Table,
} from 'react-virtualized';
// https://github.com/bvaughn/react-virtualized/issues/650

const styles = () => ({
  root: {
    display: 'flex',
    height: '100%',
    flexGrow: 1,
  },
  container: {
    height: '100%',
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
    this._noRowsRenderer = this._noRowsRenderer.bind(this);
    this._sort = this._sort.bind(this);
  }

  render() {
    const { classes, list, analysisView } = this.props;
    const rowGetter = ({index}) => this._getDatum(list, index);
    //https://github.com/bvaughn/react-virtualized/blob/master/docs/usingAutoSizer.md


    let modifier = '';
    let base = '';
    let collector = '';
    let collectionYear = '';
    if (analysisView) {
      modifier = (
        <Column
          label="Modifier"
          cellDataGetter={({rowData}) => rowData.modifier}
          dataKey="modifier"
          width={150}
        />
      );
      base = (
        <Column
          label="Base"
          cellDataGetter={({rowData}) => rowData.basicElement}
          dataKey="basicElement"
          width={150}
        />
      );
      collector = (
        <Column
          label="Collector"
          cellDataGetter={({rowData}) => rowData.collector}
          dataKey="collector"
          width={150}
        />
      );
      collectionYear = (
        <Column
          label="Year"
          cellDataGetter={({rowData}) => rowData.collectionYear}
          dataKey="collectionYear"
          width={150}
        />
      );
    }

    const csvLink = <CSVLink data={list.toArray()}>Results as CSV</CSVLink>;

    return (
      <div className={classes.root}>
        <Grid container className={classes.container}>
          <div className={classes.resultsInfo}>
            <div className={classes.searchField}>
              <IntegrationAutosuggest
                search={this.props.search}
                updateQuery={this.props.updateQuery}
                fetchSuggestions={this.props.fetchSuggestions}
                clearSuggestions={this.props.clearSuggestions}
                fetchResults={this.props.fetchResults}
                clearResults={this.props.clearResults}
                updateResultFormat={this.props.updateResultFormat}
              />
            </div>
            {this.props.list.size > 0 &&
              <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>Result options</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                  <Grid container>
                    <Grid item xs={12}>
                      <DatasetSelector
                        datasets={this.props.search.datasets}
                        toggleDataset={this.props.toggleDataset}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <ResultFilterDialog resultValues={this.props.resultValues} updateResultsFilter={this.props.updateResultsFilter} />
                    </Grid>
                    <Grid item xs={12}>

                      <Button >
                        Results as CSV
                      </Button>
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            }
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
                    sort={this._sort}
                    sortBy={this.props.search.sortBy}
                    sortDirection={this.props.search.sortDirection.toUpperCase()}
                    width={width}
                    height={height}
                    headerHeight={50}
                    noRowsRenderer={this._noRowsRenderer}
                    style={tableStyles.tableRoot}
                    rowStyle={calculateRowStyle}
                  >
                    <Column
                      label="Name"
                      cellDataGetter={({rowData}) => rowData.label}
                      dataKey="label"
                      width={150}
                    />
                    {modifier}
                    {base}
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
                    {collector}
                    {collectionYear}
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

  _sort({ sortBy, sortDirection }) {
    this.props.sortResults({ sortBy, sortDirection: sortDirection.toLowerCase() });
  }
}

VirtualizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
  list: PropTypes.instanceOf(Immutable.List).isRequired,
  search: PropTypes.object.isRequired,
  resultValues: PropTypes.object.isRequired,
  sortResults: PropTypes.func.isRequired,
  updateResultsFilter: PropTypes.func.isRequired,
  toggleDataset: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
  clearSuggestions: PropTypes.func.isRequired,
  fetchResults: PropTypes.func.isRequired,
  clearResults: PropTypes.func.isRequired,
  updateResultFormat: PropTypes.func.isRequired,
  analysisView: PropTypes.bool.isRequired
};

export default withStyles(styles)(VirtualizedTable);
