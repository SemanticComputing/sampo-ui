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
    return (
      <div style={{ maxWidth: '100%' }}>
        <MaterialTable
          columns={[
            { title: 'Adı', field: 'name' },
            { title: 'Soyadı', field: 'surname' },
            { title: 'Doğum Yılı', field: 'birthYear', type: 'numeric' },
            { title: 'Doğum Yeri', field: 'birthCity', lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' } }
          ]}
          data={[{ name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 }]}
          title="Demo Title"
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
  data: PropTypes.object,
};

export default ResultTable2;
