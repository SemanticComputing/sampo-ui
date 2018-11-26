import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';
import Typography from '@material-ui/core/Typography';

const styles = () => ({
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '60vh',
  },
});

class FacetDialog extends React.Component {

  componentDidMount = () => {
    // console.log('facet dialog mounted, fetch facet');
    this.props.fetchFacet();
  }

  handleClose = () => this.props.closeFacetDialog();

  render() {
    const { classes } = this.props;
    return (
      <Dialog
        classes={{ paper: classes.dialogPaper }}
        open={this.props.facet.facetDialogOpen}
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
        keepMounted={true}
      >
        <DialogTitle disableTypography={true}>
          <Typography variant="h6">{this.props.propertyLabel}</Typography>
        </DialogTitle>
        <DialogContent>
          {this.props.facet.fetchingFacet ?
            <CircularProgress style={{ color: purple[500] }} thickness={5} />
            :
            <Tree
              data={this.props.facet.facetValues.creationPlace}
              fetchFacet={this.props.fetchFacet}
              updateFilter={this.props.updateFilter}
            />}
        </DialogContent>
      </Dialog>
    );
  }
}

FacetDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  propertyLabel: PropTypes.string.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired,
  updateFilter: PropTypes.func.isRequired,
  closeFacetDialog: PropTypes.func.isRequired
};

export default withStyles(styles)(FacetDialog);
