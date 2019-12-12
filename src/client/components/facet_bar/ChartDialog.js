import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PieChartIcon from '@material-ui/icons/PieChart';
import Tooltip from '@material-ui/core/Tooltip';
import GeneralDialog from '../main_layout/GeneralDialog';
import ApexChart from '../facet_results/ApexChart';

const ChartDialog = props => {
  const [open, setOpen] = React.useState(false);
  const { fetchFacetConstrainSelf, facetID, facetClass, data, fetching  } = props;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return(
    <React.Fragment>
      <Tooltip disableFocusListener={true} title="Chart">
        <IconButton
          aria-label="Chart"
          aria-owns={open ? 'facet-option-menu' : undefined}
          aria-haspopup="true"
          onClick={handleClickOpen}
        >
          <PieChartIcon />
        </IconButton>
      </Tooltip>
      <GeneralDialog
        open={open}
        onClose={handleClose}
      >
        <ApexChart
          facetID={facetID}
          facetClass={facetClass}
          fetchFacetConstrainSelf={fetchFacetConstrainSelf}
          data={data}
          fetching={fetching}
          options={{
            chart: {
              type: 'pie',
              width: '100%',
              height: '100%',
              //parentHeightOffset: 0,
              fontFamily: 'Roboto',
            },
            legend: {
              position: 'right',
              width: 400,
              fontSize: 14,
              itemMargin: {
                horizontal: 5
              }
            }
          }}
        />
      </GeneralDialog>
    </React.Fragment>
  );
};

ChartDialog.propTypes = {
  facetID: PropTypes.string,
  facetClass: PropTypes.string,
  data: PropTypes.array,
  fetching: PropTypes.bool.isRequired,
  fetchFacetConstrainSelf: PropTypes.func
};

export default ChartDialog;
