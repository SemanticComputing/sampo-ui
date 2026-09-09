import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import intl from 'react-intl-universal'
import TextPage from 'components/main_layout/TextPage'
import HTMLParser from 'helpers/HTMLParser'
import { useConfigsStore } from 'stores/configsStore'

const HTML_FILE_PREFIX = 'htmlFile:'

/**
 * Renders the content of a static/dummy-internal page identified by a locale key.
 *
 * The locale value at `id` is either:
 *  - inline HTML (rendered as before via intl.getHTML), or
 *  - a reference to an external HTML file, marked with the `htmlFile:` prefix
 *    (e.g. "htmlFile:pages/about_en.html"), resolved relative to the portal config
 *    root and fetched at runtime. Each locale points to its own file, so per-language
 *    content is handled by the translation files as usual.
 */
const InternalPage = props => {
  const { id, layoutConfig } = props
  const raw = intl.get(id)
  const isFileRef = typeof raw === 'string' && raw.startsWith(HTML_FILE_PREFIX)
  const [html, setHtml] = useState(null)

  useEffect(() => {
    if (!isFileRef) {
      return
    }
    let cancelled = false
    const path = raw.slice(HTML_FILE_PREFIX.length).trim()
    setHtml(null)
    useConfigsStore.getState().getConfigTextFile(path)
      .then(content => {
        if (!cancelled) {
          setHtml(content)
        }
      })
      .catch(error => {
        if (!cancelled) {
          console.error(`Failed to load HTML page from "${path}":`, error)
          setHtml('')
        }
      })
    return () => { cancelled = true }
  }, [raw, isFileRef])

  if (!isFileRef) {
    return (
      <TextPage layoutConfig={layoutConfig}>
        {intl.getHTML(id)}
      </TextPage>
    )
  }

  if (html === null) {
    return null
  }

  const parser = new HTMLParser({ HTMLParserTask: 'addReactRouterLinks' })
  return (
    <TextPage layoutConfig={layoutConfig}>
      {parser.parseHTML(html)}
    </TextPage>
  )
}

InternalPage.propTypes = {
  /**
   * The locale key whose value is either inline HTML or an `htmlFile:` reference.
   */
  id: PropTypes.string.isRequired,
  layoutConfig: PropTypes.object.isRequired
}

export default InternalPage
