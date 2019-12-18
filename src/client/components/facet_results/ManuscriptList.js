import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    marginTop: theme.spacing(1)
  }
});

let ManuscriptList = (props) => {
  const { classes, manuscripts } = props;
  let items = '';
  const isArray = Array.isArray(manuscripts);
  if (isArray) {
    items = manuscripts.map(m =>
      <li key={m.id}>
        <Typography>
          <Link to={m.dataProviderUrl}>{m.prefLabel}</Link>
        </Typography>
      </li>);
  }
  return(
    <div className={classes.root}>
      {isArray &&
        <React.Fragment>
          <Typography>Manuscripts:</Typography>
          <ul>
            {items}
          </ul>
        </React.Fragment>
      }
      {!isArray &&
        <React.Fragment>
          <Typography>Manuscript:</Typography>
          <Typography>
            <Link to={manuscripts.dataProviderUrl}>{manuscripts.prefLabel}</Link>
          </Typography>
        </React.Fragment>
      }
    </div>
  );
};

ManuscriptList.propTypes = {
  classes: PropTypes.object.isRequired,
  manuscripts:  PropTypes.oneOfType([PropTypes.object, PropTypes.array])
};

export default withStyles(styles)(ManuscriptList);
