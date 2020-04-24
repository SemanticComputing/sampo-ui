import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import intl from 'react-intl-universal'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
// import FormLabel from '@material-ui/core/FormLabel';
import FormGroup from '@material-ui/core/FormGroup'
import Checkbox from '@material-ui/core/Checkbox'
import InfoIcon from '@material-ui/icons/Info'

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    marginLeft: theme.spacing(2)
  },
  formControl: {
    width: '100%'
  },
  formControlLabelRoot: {
    width: '100%',
    [theme.breakpoints.down('md')]: {
      marginBottom: theme.spacing(1)
    }
  },
  formControlLabelLabel: {
    width: '100%'
  },
  checkboxLabel: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.875rem'
  },
  link: {
    display: 'flex',
    textDecoration: 'none',
    alignItems: 'center',
    color: theme.palette.primary.main,
    '&:visited': {
      color: theme.palette.primary.main
    }
  }
})

class DatasetSelector extends React.Component {
  handleToggleDataset = value => () => {
    this.props.clientFSToggleDataset(value)
  };

  generateLabel = id => {
    const { perspectiveID } = this.props
    return (
      <div className={this.props.classes.checkboxLabel}>
        <span>{intl.get(`perspectives.${perspectiveID}.datasets.${id}.label`)}</span>
        <a
          className={this.props.classes.link}
          href={intl.get(`perspectives.${perspectiveID}.datasets.${id}.aboutLink`)}
          target='_blank'
          rel='noopener noreferrer'
        >
          <InfoIcon />
        </a>
      </div>
    )
  }

  render () {
    const { classes } = this.props
    return (
      <div className={classes.root}>
        <FormControl component='fieldset' className={classes.formControl}>
          <FormGroup className={classes.formGroup}>
            {Object.keys(this.props.datasets).map(id => (
              <FormControlLabel
                classes={{
                  root: classes.formControlLabelRoot,
                  label: classes.formControlLabelLabel
                }}
                key={id}
                control={
                  <Checkbox
                    checked={this.props.datasets[id].selected}
                    onChange={this.handleToggleDataset(id)}
                    tabIndex={-1}
                    disableRipple
                  />
                }
                label={this.generateLabel(id)}
              />

            ))}
          </FormGroup>
        </FormControl>
      </div>
    )
  }
}

DatasetSelector.propTypes = {
  classes: PropTypes.object.isRequired,
  datasets: PropTypes.object.isRequired,
  clientFSToggleDataset: PropTypes.func.isRequired,
  perspectiveID: PropTypes.string.isRequired
}

export default withStyles(styles)(DatasetSelector)
