import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
// import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit * 3,
  },
});

class CheckboxesGroup extends React.Component {

  constructor(props) {
    super(props);
    //console.log(this.props.data)
    let o = this.props.data.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    },{});
    this.state = o;
  }

  handleChange = name => event => {
    const newObj = this.state[name];
    newObj.selected = event.target.checked;
    this.props.updateFilter({
      property: 'source',
      value: name
    });
    this.setState(
      { [name]: newObj }
    );
  };

  render() {
    const { classes } = this.props;
    //console.log(this.state)
    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormGroup>
            {Object.values(this.state).map(o =>
              <FormControlLabel
                key={o.id}
                control={
                  <Checkbox checked={o.selected == null ? false : o.selected} onChange={this.handleChange(o.id)} value={o.id} />
                }
                label={`${o.prefLabel} (${o.instanceCount})`}
              />
            )}
          </FormGroup>
        </FormControl>
      </div>
    );
  }
}

CheckboxesGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired,
  updateFilter: PropTypes.func.isRequired
};

export default withStyles(styles)(CheckboxesGroup);
