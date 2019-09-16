import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import CircularProgress from '@material-ui/core/CircularProgress';
import ResultTableCell from './ResultTableCell';
import purple from '@material-ui/core/colors/purple';
import Paper from '@material-ui/core/Paper';
//import { has } from 'lodash';

const styles = () => ({
  progressContainer: {
    width: '100%',
    height: 'calc(100% - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableContainer: {
    maxWidth: '100%',
    height: 'calc(100% - 72px)'
  }
});

class MaterialTableFullTextResults extends React.Component {


  render() {
    const results  = this.props.data;
    let resultText = results == 1 ? 'result' : 'results';
    if (this.props.fetching) {
      return (
        <Paper square className={this.props.classes.progressContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </Paper>
      );
    } else {
      return (
        <div className={this.props.classes.tableContainer}>
          <MaterialTable
            columns={[
              {
                title: 'Label',
                field: 'prefLabel',
                render: data =>
                  <ResultTableCell
                    columnId='prefLabel'
                    data={data.prefLabel}
                    valueType='object'
                    makeLink={true}
                    externalLink={true}
                    sortValues={true}
                    numberedList={false}
                    minWidth={150}
                    container='div'
                    expanded={true}
                  />
              },
              {
                title: 'Type',
                field: 'type',
                render: data =>
                  <ResultTableCell
                    columnId='type'
                    data={data.type}
                    valueType='object'
                    makeLink={false}
                    externalLink={false}
                    sortValues={true}
                    numberedList={false}
                    minWidth={150}
                    container='div'
                    expanded={true}
                  />
              },
              {
                title: 'Source',
                field: 'source',
                render: data =>
                  <ResultTableCell
                    columnId='source'
                    data={data.source}
                    valueType='object'
                    makeLink={true}
                    externalLink={true}
                    sortValues={true}
                    numberedList={false}
                    minWidth={150}
                    container='div'
                    expanded={true}
                  />
              },
            ]}
            data={results}
            title={results > 1 ?
              `Search term: "${this.props.query}", ${results.length} ${resultText}` :
              ''
            }
            icons={{
              Search: SearchIcon,
              ResetSearch: ClearIcon,
              FirstPage: FirstPageIcon,
              LastPage: LastPageIcon,
              NextPage: ChevronRightIcon,
              PreviousPage: ChevronLeftIcon
            }}
            options={{
              maxBodyHeight: '100%',
              pageSize: 15,
              pageSizeOptions: [10, 15, 20, 25]
            }}
          />
        </div>
      );
    }
  }
}

MaterialTableFullTextResults.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  query: PropTypes.string,
  fetching: PropTypes.bool.isRequired
};

export default withStyles(styles)(MaterialTableFullTextResults);
