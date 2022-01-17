import React from 'react'
import ReactWordcloud from 'react-wordcloud'
import makeStyles from '@mui/styles/makeStyles';
import Paper from '@mui/material/Paper'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css'

const options = {
  rotations: 0,
  fontSizes: [14, 60],
  deterministic: true
}

const useStyles = makeStyles(theme => ({
  wordCloudOuterContainer: props => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bdbdbd'
  }),
  wordCloudInnerContainer: props => ({
    width: '100%',
    height: '100%',
    [theme.breakpoints.down('lg')]: {
      minHeight: 400,
      overflow: 'auto'
    },
    [theme.breakpoints.up('lg')]: {
      width: '50%',
      height: '50%'
    }
  })
}))

const Wordcloud = props => {
  const { data, maxWords } = props
  const classes = useStyles(props)

  if (data == null) {
    return (<></>)
  }

  data.forEach(el => {
    el.weight = +el.weight
  })

  // sort without mutating the original array
  let words = [...data].sort((a, b) => b.weight - a.weight)
  if (words.length > maxWords) {
    words.splice(maxWords)
  }
  words = words.map(item => ({ text: item.prefLabel, value: item.weight }))

  return (
    <div className={classes.wordCloudOuterContainer}>
      <Paper className={classes.wordCloudInnerContainer}>
        <ReactWordcloud
          options={options}
          words={words}
        />
      </Paper>
    </div>
  )
}

export default Wordcloud
