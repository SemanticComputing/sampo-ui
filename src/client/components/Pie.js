import React from 'react';
import PropTypes from 'prop-types';
import { VictoryPie, VictoryLegend } from 'victory';
import _ from 'lodash';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 3,
    width: 700,
    height: 500,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  }
});

const categories = [
  'Kylä',
  'Rakennettu kohde',
  'Vesimuodostuma',
  'Maastokohde',
  'Kirkonkylä , kaupunki',
  'Kylä',
  'Symboli'
];

let Pie = (props) => {
  const { classes, data } = props;
  const grouped = _.groupBy(data,'typeLabel');
  let dataArray = [], legendArray  = [];
  for (let key in grouped) {
    const length = grouped[key].length;
    dataArray.push({
      x: key,
      y: length,
      values: grouped[key]
    });
    legendArray.push({ name: key + ' (' + length + ')' });
  }

  return(
    <svg
      width={700}
      height={500}
      className={classes.root}
    >
      <VictoryLegend standalone={false}
        colorScale={'warm'}
        x={400} y={40}
        width={300}
        height={300}
        gutter={15}
        title='Place type'
        centerTitle
        data={legendArray}
      />
      <VictoryPie standalone={false}
        width={300}
        height={300}
        padding={{
          left: 0, bottom: 0, top: 0
        }}
        colorScale={'warm'}
        data={dataArray}
        categories={categories}
        labels={() => null}
        animate={{
          duration: 2000
        }}
      />

    </svg>
  );
};

Pie.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array.isRequired
};

export default withStyles(styles)(Pie);
