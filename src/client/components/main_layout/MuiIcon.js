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

const MuiIcon = props => {
  const MuiIcons = {
    CalendarViewDay: CalendarViewDay,
    TripOriginIcon: TripOrigin,
    LocationOn: LocationOn,
    AddLocation: AddLocation,
    Star: Star,
    Redo: Redo,
    PieChart: PieChart,
    CloudDownload: CloudDownload,
    BubbleChart: BubbleChart,
    ShowChart: ShowChart
  }
  const MuiIconComponent = MuiIcons[props.iconName]
  return <MuiIconComponent />
}

export default MuiIcon
