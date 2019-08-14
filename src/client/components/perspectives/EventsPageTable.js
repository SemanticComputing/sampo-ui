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

class EventsPageTable extends React.Component {

  render = () => {
    const { classes, data } = this.props;
    console.log(data.type.id)
    return(
      <Table className={classes.table}>
        <TableBody>
          <TableRow key='eventTimespan'>
            <TableCell>Date</TableCell>
            <ResultTableCell
              columnId='eventTimespan'
              data={data.eventTimespan}
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
          <TableRow key='place'>
            <TableCell>Place</TableCell>
            <ResultTableCell
              columnId='place'
              data={data.place}
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
          <TableRow key='manuscript'>
            <TableCell>Manuscript / collection</TableCell>
            <ResultTableCell
              columnId='manuscript'
              data={data.manuscript}
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
          {data.type.id === 'http://erlangen-crm.org/current/E10_Transfer_of_Custody' &&
            <React.Fragment>
              <TableRow key='surrender'>
                <TableCell>Custody surrendered by</TableCell>
                <ResultTableCell
                  columnId='surrender'
                  data={data.surrender}
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
              <TableRow key='receiver'>
                <TableCell>Custody received by</TableCell>
                <ResultTableCell
                  columnId='receiver'
                  data={data.receiver}
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
            </React.Fragment>      
          }
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

EventsPageTable.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default withStyles(styles)(EventsPageTable);
