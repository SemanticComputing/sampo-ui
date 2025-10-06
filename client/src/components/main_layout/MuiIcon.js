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
  TrendingDown,
  Tune,
  ArrowForward,
  Subject
} from '@mui/icons-material'
import has from 'lodash'

const MuiIcon = props => {
  const MuiIcons = {
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
    TrendingDown,
    Tune,
    ArrowForward,
    Subject
  }
  if (has(MuiIcons, props.iconName)) {
    const MuiIconComponent = MuiIcons[props.iconName]
    return <MuiIconComponent />
  } else {
    return <div />
  }
}

export default MuiIcon
