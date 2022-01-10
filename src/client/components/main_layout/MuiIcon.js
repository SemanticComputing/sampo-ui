import React from 'react'
import {
  CalendarViewDay,
  CalendarToday,
  TripOrigin,
  LocationOn,
  AddLocation,
  Star,
  Redo,
  PieChart,
  CloudDownload,
  BubbleChart,
  ShowChart,
  FormatAlignJustify,
  ClearAll,
  OndemandVideo,
  KeyboardVoice,
  Autorenew,
  Add,
  PlayArrow,
  MailOutline,
  TrendingDown
} from '@material-ui/icons'
import has from 'lodash'

const MuiIcon = props => {
  const MuiIcons = {
    CalendarViewDay: CalendarViewDay,
    CalendarToday: CalendarToday,
    TripOrigin: TripOrigin,
    LocationOn: LocationOn,
    AddLocation: AddLocation,
    Star: Star,
    Redo: Redo,
    PieChart: PieChart,
    CloudDownload: CloudDownload,
    BubbleChart: BubbleChart,
    ShowChart: ShowChart,
    FormatAlignJustify: FormatAlignJustify,
    ClearAll: ClearAll,
    OndemandVideo: OndemandVideo,
    KeyboardVoice: KeyboardVoice,
    Autorenew: Autorenew,
    Add: Add,
    PlayArrow: PlayArrow,
    MailOutline: MailOutline,
    TrendingDown: TrendingDown
  }
  if (has(MuiIcons, props.iconName)) {
    const MuiIconComponent = MuiIcons[props.iconName]
    return <MuiIconComponent />
  } else {
    return <div />
  }
}

export default MuiIcon
