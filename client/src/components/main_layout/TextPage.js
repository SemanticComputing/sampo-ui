import React from 'react'
import PropTypes from 'prop-types'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import { getSpacing } from '../../helpers/helpers'

/**
 * A component for creating a responsive page with static content.
 */
const TextPage = props => {
  const { layoutConfig } = props
  return (
    <Box
      sx={theme => ({
        margin: theme.spacing(0.5),
        width: `calc(100% - ${getSpacing(theme, 1)}px)`,
        [theme.breakpoints.up(layoutConfig.hundredPercentHeightBreakPoint)]: {
          height: `calc(100% - ${layoutConfig.topBar.reducedHeight + getSpacing(theme, 1)}px)`
        },
        [theme.breakpoints.up(layoutConfig.reducedHeightBreakpoint)]: {
          height: `calc(100% - ${layoutConfig.topBar.defaultHeight + getSpacing(theme, 1)}px)`
        }
      })}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Paper
          sx={theme => ({
            width: 'auto',
            padding: theme.spacing(3),
            marginLeft: theme.spacing(3),
            marginRight: theme.spacing(3),
            [theme.breakpoints.down('md')]: {
              padding: theme.spacing(1.5),
              marginLeft: 0,
              marginRight: 0
            },
            [theme.breakpoints.up(1100 + getSpacing(theme, 6))]: {
              width: 1100,
              marginLeft: 'auto',
              marginRight: 'auto'
            },
            overflow: 'auto',
            '& h1': {
              ...theme.typography.h2,
              marginTop: 0,
              marginBottom: theme.spacing(1)
            },
            '& h2': {
              ...theme.typography.h4
            },
            '& h3': {
              ...theme.typography.h6
            },
            '& p, li': {
              ...theme.typography.body1
            }
          })}
        >
          {props.children}
        </Paper>
      </Box>
    </Box>
  )
}

TextPage.propTypes = {
  layoutConfig: PropTypes.object.isRequired,
  /**
   * The content of the page.
   */
  children: PropTypes.node
}

export default TextPage
