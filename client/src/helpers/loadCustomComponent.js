const componentCache = {}

export const loadCustomComponent = (componentName) => {
  return new Promise((resolve, reject) => {
    if (componentCache[componentName]) {
      return resolve(componentCache[componentName])
    }

    // This path must match where the custom bundle is mounted in the container
    const scriptId = `custom-component-${componentName}`
    if (document.getElementById(scriptId)) {
      // Script tag already added, wait for it
      const poll = setInterval(() => {
        const module = window.__customComponents?.[componentName]
        if (module) {
          clearInterval(poll)
          const component = module.default || module
          componentCache[componentName] = component
          resolve(componentCache[componentName])
        }
      }, 50)
      return
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = `/custom-components/${componentName}.js`
    script.onload = () => {
      const module = window.__customComponents?.[componentName]
      if (module) {
        const component = module.default
        componentCache[componentName] = component
        resolve(component)
      } else {
        reject(new Error(`Custom component "${componentName}" did not register itself on window.__customComponents`))
      }
    }
    script.onerror = () => reject(new Error(`Failed to load script for "${componentName}"`))
    document.head.appendChild(script)
  })
}
