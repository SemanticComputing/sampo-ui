import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import EnhancedTable from './EnhancedTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '60vh',
    maxWidth: '100vh',
  },
});

class FacetDialog extends React.Component {

  componentDidMount = () => {
    // console.log('facet dialog mounted, fetch facet');
    this.props.fetchFacet();
  }

  handleClose = () => this.props.closeFacetDialog();

  facetRenderer = facetValues => {
    const { activeFacet, facetOptions } = this.props.facet;
    const hierarchical = facetOptions[activeFacet] == null ? null : facetOptions[activeFacet].hierarchical;
    if (activeFacet != '' && hierarchical) {
      return (
        <Tree
          data={facetValues}
          fetchFacet={this.props.fetchFacet}
          updateFilter={this.props.updateFilter}
        />
      );
    } else if (activeFacet != '') {
      return <EnhancedTable data={facetValues} />;
    } else {
      return '';
    }
  }

  render() {
    const { classes, facet } = this.props;
    const label = facet.facetOptions[facet.activeFacet] == null ? '' : facet.facetOptions[facet.activeFacet].label;
    const facetValues = facet.facetValues[facet.activeFacet] == null ? [] : facet.facetValues[facet.activeFacet];

    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.facet.facetDialogOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        keepMounted={true}
        disableRestoreFocus={true}
      >
        <DialogTitle disableTypography={true}>
          <Typography variant="h6">{label}</Typography>
        </DialogTitle>
        <DialogContent>
          {this.props.facet.fetchingFacet || facetValues.length == 0 ?
            <CircularProgress style={{ color: purple[500] }} thickness={5} /> :
            this.facetRenderer(facetValues)
          }
        </DialogContent>
      </Dialog>
    );
  }
}

FacetDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  closeFacetDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetDialog);
