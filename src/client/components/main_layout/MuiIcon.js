import React from 'react'
import {
  CalendarViewDay,
  TripOrigin,
  LocationOn,
  AddLocation,
  Star,
  Redo,
  PieChart,
  CloudDownload,
  BubbleChart,
  ShowChart
} from '@material-ui/icons'
import has from 'lodash'

const MuiIcon = props => {
  const MuiIcons = {
    CalendarViewDay: CalendarViewDay,
    TripOrigin: TripOrigin,
    LocationOn: LocationOn,
    AddLocation: AddLocation,
    Star: Star,
    Redo: Redo,
    PieChart: PieChart,
    CloudDownload: CloudDownload,
    BubbleChart: BubbleChart,
    ShowChart: ShowChart
  }
  if (has(MuiIcons, props.iconName)) {
    const MuiIconComponent = MuiIcons[props.iconName]
    return <MuiIconComponent />
  } else {
    return <div />
  }
}

export default MuiIcon
