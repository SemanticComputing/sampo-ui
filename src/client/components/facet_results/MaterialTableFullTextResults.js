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

class MaterialTableFullTextResults extends React.Component {

  render() {
    let resultText = this.props.data.length == 1 ? 'result' : 'results';
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
                field: 'type.prefLabel',
                render: rowData => rowData.type.prefLabel
              },
              {
                title: 'Data provider link',
                field: 'dataProviderUrl',
                render: rowData => {
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
            title={this.props.data.length > 1 ?
              `Search term: "${this.props.query}", ${this.props.data.length} ${resultText}` :
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
