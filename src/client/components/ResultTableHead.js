import React from 'react';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import FacetDialog from './FacetDialog';


class ResultTableHead extends React.Component {

  render() {
    const columns = [
      {
        label: 'ID',
        property: 'id',
        desc: 'ID description'
      },
      {
        label: 'Title',
        property: 'prefLabel',
        desc: 'Title description'
      },
      {
        label: 'Author',
        property: 'author',
        desc: 'Author description'
      },
      {
        label: 'Creation place',
        property: 'creationPlace',
        desc: 'Creation place description',
        filter: true
      },
      {
        label: 'Creation date',
        property: 'timespan',
        desc: 'Creation date description'
      },
      {
        label: 'Language',
        property: 'language',
        desc: 'Language description'
      },
      {
        label: 'Material',
        property: 'material',
        desc: 'Material description'
      },
    ];

    return (
      <TableHead>
        <TableRow>
          {columns.map(column => {
            return (
              <TableCell key={column.label}>
                <Tooltip
                  title={column.desc}
                  enterDelay={200}
                >
                  <span>{column.label}</span>
                </Tooltip>
                {column.filter &&
                  <Tooltip title={'Filter ' + column.label}>
                    <FacetDialog
                      property={column.property}
                      propertyLabel={column.label}
                      fetchFacet={this.props.fetchFacet}
                      facet={this.props.facet} />
                  </Tooltip>}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
    );
  }
}

ResultTableHead.propTypes = {
  fetchFacet: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired
};

export default ResultTableHead;
