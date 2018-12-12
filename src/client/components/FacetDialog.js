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
import CheckboxesGroup from './CheckboxesGroup';

const styles = () => ({
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    //minWidth: '90vh',
    maxWidth: 'calc(100% - 30px)',
  },
});

class FacetDialog extends React.Component {

  componentDidMount = () => {
    this.props.fetchFacet();
  }

  // componentDidUpdate = prevProps => {
  //   if (prevProps.facet.facetFilters != this.props.facet.facetFilters) {
  //     this.props.fetchFacet();
  //   }
  // }

  handleClose = () => this.props.closeFacetDialog();

  facetRenderer = facetValues => {
    const { activeFacet, facetOptions } = this.props.facet;
    const facetType = facetOptions[activeFacet] == null ? null : facetOptions[activeFacet].type;
    if (activeFacet != '') {
      switch(facetType) {
        case 'hierarchical':
          return (
            <Tree
              data={facetValues}
              updateFilter={this.props.updateFilter}
            />
          );
        case 'table':
          return <EnhancedTable
            data={facetValues}
            updateFilter={this.props.updateFilter}
          />;
        case 'checkboxes':
          return <CheckboxesGroup
            data={facetValues}
            updateFilter={this.props.updateFilter}
          />;
      }
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
