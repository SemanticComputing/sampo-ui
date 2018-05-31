import React from 'react';
import PropTypes from 'prop-types';
import MUIDataTable from 'mui-datatables';

const columns = [
  {
    name: 'Name',
    options: {
      filter: false,
      sort: true,
    }
  },
  {
    name: 'Type',
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: 'Area',
    options: {
      filter: true,
      sort: true,
    }
  },
  {
    name: 'Source',
    options: {
      filter: true,
      sort: true,
    }
  },
];

const options = {

};

const DataTable = (props) => {
  const dataArray = props.data.map(obj => {
    const values = Object.values(obj);
    return [values[1], values[2], values[3], values[4]];
  });

  return (
    <MUIDataTable
      title={'Search results'}
      data={dataArray}
      columns={columns}
      options={options}
    />
  );
};

DataTable.propTypes = {
  data: PropTypes.array.isRequired
};

export default DataTable;
