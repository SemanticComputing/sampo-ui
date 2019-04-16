import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable from 'material-table';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

class ResultTable2 extends React.Component {
  render() {
    console.log(this.props.data)
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
            { title: 'URI', field: 'id' },
            {
              title: 'Type',
              field: 'type',
              render: rowData =>
                <a
                  target='_blank' rel='noopener noreferrer'
                  href={rowData.type.id}
                >
                  {rowData.type.prefLabel}
                </a>
            },
            { title: 'Source', field: 'source' },
          ]}
          data={this.props.data}
          title="Search results"
          icons={{
            Search: SearchIcon,
            ResetSearch: ClearIcon,
            FirstPage: FirstPageIcon,
            LastPage: LastPageIcon,
            NextPage: ChevronRightIcon,
            PreviousPage: ChevronLeftIcon
          }}
        />
      </div>
    );
  }
}

ResultTable2.propTypes = {
  data: PropTypes.array,
};

export default ResultTable2;
