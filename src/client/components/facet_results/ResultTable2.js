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
import purple from '@material-ui/core/colors/purple';
import { has } from 'lodash';

const styles = () => ({
  progressContainer: {
    width: '100%',
    height: 'calc(100% - 72px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class ResultTable2 extends React.Component {
  render() {
    //console.log(this.props.data)
    if (this.props.fetching) {
      return (
        <div className={this.props.classes.progressContainer}>
          <CircularProgress style={{ color: purple[500] }} thickness={5} />
        </div>
      );
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            columns={[
              {
                title: 'Label',
                field: 'prefLabel',
                render: rowData =>
                  <a
                    target='_blank' rel='noopener noreferrer'
                    href={rowData.id}
                  >
                    {rowData.prefLabel}
                  </a>
              },
              {
                title: 'Type',
                field: 'type',
                render: rowData => rowData.type.prefLabel
              },
              {
                title: 'Data provider link',
                field: 'dataProviderUrl',
                render: rowData => {
                  console.log(rowData)
                  if (has(rowData, 'source') && has(rowData, 'dataProviderUrl')) {
                    return(
                      <a
                        target='_blank' rel='noopener noreferrer'
                        href={rowData.dataProviderUrl}
                      >
                        {rowData.source.prefLabel}
                      </a>
                    );
                  }
                }
              },
            ]}
            data={this.props.data}
            title="Full text search results"
            icons={{
              Search: SearchIcon,
              ResetSearch: ClearIcon,
              FirstPage: FirstPageIcon,
              LastPage: LastPageIcon,
              NextPage: ChevronRightIcon,
              PreviousPage: ChevronLeftIcon
            }}
            options={{
              pageSize: 25,
              pageSizeOptions: [10, 15, 20, 25]
            }}
          />
        </div>
      );
    }
  }
}

ResultTable2.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  fetching: PropTypes.bool.isRequired
};

export default withStyles(styles)(ResultTable2);
