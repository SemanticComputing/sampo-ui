// Injects a custom stylesheet (configured via portalConfig's layoutConfig.customCssFile)
// into <head>. It is appended after the bundled index.css <style> tag, so its rules win
// cascade ties against the main CSS.
export const loadCustomCss = (href, linkId = 'custom-portal-css') => {
  if (!href) {
    return
  }

  if (document.getElementById(linkId)) {
    // Already injected
    return
  }

  const link = document.createElement('link')
  link.id = linkId
  link.rel = 'stylesheet'
  link.href = href
  document.head.appendChild(link)
}
