import React, { useState, useEffect } from 'react'
import { loadCustomComponent } from '../helpers/loadCustomComponent'

const CustomComponentWrapper = ({ componentName, ...props }) => {
  const [Component, setComponent] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCustomComponent(componentName)
      .then(component => setComponent(() => component))
      .catch(setError)
  }, [componentName])

  if (error) return <div>Failed to load custom component: {componentName}</div>
  if (!Component) return <div>Loading...</div>
  return <Component {...props} />
}

export default CustomComponentWrapper
