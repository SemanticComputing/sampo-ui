import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import FilterListIcon from '@material-ui/icons/FilterList';
import { withStyles } from '@material-ui/core/styles';
import Tree from './Tree';
import CircularProgress from '@material-ui/core/CircularProgress';
import purple from '@material-ui/core/colors/purple';

const styles = () => ({
  root: {
    display: 'inline'
  },
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
    minWidth: '60vh',
  },
});

class FacetDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      isLoading: false,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.facet.fetchingFacet !== this.props.facet.fetchingFacet) {
      this.setState({
        isLoading: this.props.facet.fetchingFacet,
      });
    }
  }

  handleClickOpen = () => {
    this.props.fetchFacet(this.props.property);
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes, propertyLabel, facet } = this.props;
    return (
      <div className={classes.root}>
        <IconButton
          onClick={this.handleClickOpen}
          aria-label="Filter"
        >
          <FilterListIcon className={classes.iconButton} />
        </IconButton>
        <Dialog
          classes={{ paper: classes.dialogPaper }}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">{propertyLabel}</DialogTitle>
          <DialogContent>
            {this.state.isLoading ? <CircularProgress style={{ color: purple[500] }} thickness={5} /> : <Tree data={facet.values} />  }
          </DialogContent>

        </Dialog>
      </div>
    );
  }
}


FacetDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  property: PropTypes.string.isRequired,
  propertyLabel: PropTypes.string.isRequired,
  fetchFacet: PropTypes.func.isRequired,
  facet: PropTypes.object.isRequired,
};

export default withStyles(styles)(FacetDialog);
