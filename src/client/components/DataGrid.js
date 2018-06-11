import React from 'react';
import PropTypes from 'prop-types';
import ReactDataGrid from 'react-data-grid';
import { Toolbar, Data, Filters } from 'react-data-grid-addons';
const { MultiSelectFilter } = Filters;
const { Selectors } = Data;
import 'bootstrap/dist/css/bootstrap.css';

class DataGrid extends React.Component {
  constructor(props, context) {
    super(props, context);
    this._columns = [
      {
        key: 'label',
        name: 'Name',
        sortable: true,
        filterable: true,
      },
      {
        key: 'typeLabel',
        name: 'Type',
        sortable: true,
        filterable: true,
        filterRenderer: MultiSelectFilter
      },
      {
        key: 'broaderAreaLabel',
        name: 'Area',
        sortable: true,
        filterable: true,
        filterRenderer: MultiSelectFilter
      },
      {
        key: 'source',
        name: 'Source',
        sortable: true,
        filterable: true,
        filterRenderer: MultiSelectFilter
      },
    ];
    this.state = {
      rows: this.props.data,
      sortColumn: null,
      sortDirection: null
    };
  }

  getRows = () => {
    return Selectors.getRows(this.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
  };

  handleGridSort = (sortColumn, sortDirection) => {
    this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
  };

  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({ filters: newFilters });
  };

  getValidFilterValues = (columnId) => {
    let values = this.state.rows.map(r => r[columnId]);
    return values.filter((item, i, a) => { return i === a.indexOf(item); });
  };

  onClearFilters = () => {
    this.setState({ filters: {} });
  };

  render() {
    return  (
      <ReactDataGrid
        onGridSort={this.handleGridSort}
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.getSize()}
        toolbar={<Toolbar enableFilter={true}/>}
        onAddFilter={this.handleFilterChange}
        getValidFilterValues={this.getValidFilterValues}
        onClearFilters={this.onClearFilters} />);
  }
}

DataGrid.propTypes = {
  data: PropTypes.array.isRequired,
};

export default DataGrid;
