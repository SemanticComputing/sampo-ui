import React from 'react'
import Main from './Main'
const perspectiveConfig = []

export default {
  component: Main,
  title: 'Sampo-UI/main_layout/Main'
}

export const medium = () => {
  return (
    <Main
      perspectives={perspectiveConfig}
      screenSize='md'
      rootUrl=''
    />
  )
}

export const small = () => {
  return (
    <Main
      perspectives={perspectiveConfig}
      screenSize='sm'
      rootUrl=''
    />
  )
}

export const extraLarge = () => {
  return (
    <Main
      perspectives={perspectiveConfig}
      screenSize='xl'
      rootUrl=''
    />
  )
}
