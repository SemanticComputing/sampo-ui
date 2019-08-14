import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import ResultTableCell from '../facet_results/ResultTableCell';

const styles = theme => ({
  root: {
    overflow: 'auto',
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    padding: theme.spacing(1),
    minWidth: 800,
    maxWidth: 1200
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
});

class ManuscriptsPageTable extends React.Component {

  render = () => {
    const { classes, data } = this.props;
    return(
      <Table className={classes.table}>
        <TableBody>
          <TableRow key='author'>
            <TableCell>Author</TableCell>
            <ResultTableCell
              columnId='author'
              data={data.author}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='work'>
            <TableCell>Work</TableCell>
            <ResultTableCell
              columnId='work'
              data={data.work}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='expression'>
            <TableCell>Expression</TableCell>
            <ResultTableCell
              columnId='expression'
              data={data.expression}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='productionPlace'>
            <TableCell>Production place</TableCell>
            <ResultTableCell
              columnId='productionPlace'
              data={data.productionPlace}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='productionTimespan'>
            <TableCell>Production date</TableCell>
            <ResultTableCell
              columnId='productionTimespan'
              data={data.productionTimespan}
              valueType='object'
              makeLink={false}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='language'>
            <TableCell>Language</TableCell>
            <ResultTableCell
              columnId='language'
              data={data.language}
              valueType='object'
              makeLink={true}
              externalLink={true}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='material'>
            <TableCell>Material</TableCell>
            <ResultTableCell
              columnId='material'
              data={data.material}
              valueType='object'
              makeLink={true}
              externalLink={true}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='owner'>
            <TableCell>Owner</TableCell>
            <ResultTableCell
              columnId='owner'
              data={data.owner}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='collection'>
            <TableCell>Collection</TableCell>
            <ResultTableCell
              columnId='collection'
              data={data.collection}
              valueType='object'
              makeLink={true}
              externalLink={false}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='event'>
            <TableCell>Event</TableCell>
            <ResultTableCell
              columnId='event'
              data={data.event}
              valueType='object'
              makeLink={true}
              externalLink={true}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
          <TableRow key='source'>
            <TableCell>Source</TableCell>
            <ResultTableCell
              columnId='source'
              data={data.source}
              valueType='object'
              makeLink={true}
              externalLink={true}
              sortValues={true}
              numberedList={false}
              minWidth={150}
              container='cell'
              expanded={true}
            />
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

ManuscriptsPageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(ManuscriptsPageTable);
