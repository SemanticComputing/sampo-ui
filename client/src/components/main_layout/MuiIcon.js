import React from 'react'
import * as MuiIcons from '@mui/icons-material'
import has from 'lodash'

const MuiIcon = props => {
  if (has(MuiIcons, props.iconName)) {
    const MuiIconComponent = MuiIcons[props.iconName]
    return <MuiIconComponent />
  } else {
    return <div />
  }
}

export default MuiIcon