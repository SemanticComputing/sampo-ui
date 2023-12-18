import React from 'react'
import parse from 'html-react-parser'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import { arrayToObject } from './helpers'
import { findAll, prependChild } from 'domutils'

export default class HTMLParser {
  constructor (props) {
    this.props = props
    this.referencedTermsObj = null
  }

  parseHTML (html) {
    let transform
    let preprocessNodes
    switch (this.props.HTMLParserTask) {
      case 'addReactRouterLinks':
        transform = this.addReactRouterLinks
        break
      case 'addAnnotationTooltips':
        this.processReferencedTerms()
        transform = this.addAnnotationTooltips
        preprocessNodes = this.preprocessNodes
        break
      default:
        transform = null
    }
    return parse(html, { transform, preprocessNodes })
  }

  preprocessNodes (nodes) {
    // Add new divs with ids for each section
    const sectionDivs = findAll((node) => (node.attribs.class === 'section'), nodes)
    sectionDivs.forEach(node => {
      let chapterNumber
      if (node.parent.attribs.class === 'entry-into-force' && node.parent.parent.attribs.class === 'chapter') {
        chapterNumber = node.parent.parent.children[0].children[0].data
        chapterNumber = `chapter_${chapterNumber.replace(' luku', '')}_`
        chapterNumber = chapterNumber.replace(/\s/g, '')
      } else if (node.parent.attribs.class === 'chapter') {
        chapterNumber = node.parent.children[0].children[0].data
        chapterNumber = `chapter_${chapterNumber.replace(' luku', '')}_`
        chapterNumber = chapterNumber.replace(/\s/g, '')
      } else {
        chapterNumber = ''
      }
      const sectionItemIdentifier = node.children[0].children[0].data
      let sectionNumber
      if (sectionItemIdentifier.includes('§')) {
        sectionNumber = sectionItemIdentifier.replace(/\s/g, '').replace('§', '')
      } else {
        sectionNumber = '1'
      }
      const newNode = {
        type: 'tag',
        name: 'div',
        attribs: { id: `#${chapterNumber}section_${sectionNumber}` },
        children: []
      }
      prependChild(node, newNode)
    })
    return nodes
  }

  addReactRouterLinks (node, index) {
    if (node.type === 'tag' && node.name === 'a') {
      const href = node.attribs.href
      const text = node.children[0].data
      return <Link key={index} to={href}>{text}</Link>
    }
  }

  processReferencedTerms = () => {
    const { referencedTerm } = this.props
    if (Array.isArray(referencedTerm)) {
      this.referencedTermsObj = arrayToObject({ array: referencedTerm, keyField: 'id' })
    }
  }

  addAnnotationTooltips = (node, index) => {
    const props = this.props

    // Sections: replace the divs created in preprocessNodes with new divs that hold a ref
    if (node.parent &&
      node.parent.attribs &&
      node.parent.attribs.class === 'section' &&
      node.attribs &&
      node.attribs.id &&
      node.attribs.id.includes('section')
    ) {
      const id = node.attribs.id
      return <div key={index} id={id} className='ref' ref={element => { this.props.sectionRefs.current[id] = element }} />
    }

    // Add tooltips for showing automatic annnotations
    if (this.referencedTermsObj && node.type === 'tag' && node.name === 'span' &&
    node.attribs.name === 'namedentity' && node.attribs['data-link'] && node.attribs['data-link'] !== '') {
      const linkStr = node.attribs['data-link']
      let tooltipJSX
      if (linkStr.includes(',')) {
        const urisJSX = []
        let uris = linkStr.split(',')
        uris = uris.filter(uri => this.shouldAddAnnotation(uri))
        if (uris.length === 0) { return }
        uris.forEach(uri => {
          urisJSX.push(this.renderAnnotation(uri))
        })
        tooltipJSX = (
          <div className={props.classes.tooltipContent}>
            {urisJSX}
          </div>
        )
      } else {
        const uri = linkStr
        if (!this.shouldAddAnnotation(uri)) { return }
        tooltipJSX = (
          <div className={props.classes.tooltipContent}>
            {this.renderAnnotation(uri)}
          </div>
        )
      }
      let text
      if (node.children.length > 1 && node.children[1].name === 'a') {
        const a = node.children[1]
        text = a.children[0].data
      } else {
        text = node.children[0].data
      }
      return (
        <Tooltip
          key={index}
          title={tooltipJSX}
          interactive
          placement='top'
          arrow
          classes={{
            tooltip: props.classes.tooltip
          }}
        >
          <span style={{ color: 'red', cursor: 'pointer' }}>{text}</span>
        </Tooltip>
      )
    }
  }

  shouldAddAnnotation = uri => {
    // Add annotations only for DBpedia and TTP terms which have an external link
    return (uri.startsWith('http://fi.dbpedia.org/') ||
      uri.startsWith('http://ldf.fi/ttp/')) &&
      this.referencedTermsObj[uri] && this.referencedTermsObj[uri].externalLink
  }

  renderAnnotation = uri => {
    if (uri.startsWith('http://ldf.fi/ttp/')) {
      const localID = uri.replace('http://ldf.fi/ttp/', '')
      uri = `http://ldf.fi/ttp/${encodeURIComponent(localID)}`
    }
    const { prefLabel, description, externalLink } = this.referencedTermsObj[uri]
    let source
    if (uri.startsWith('http://ldf.fi/ttp/')) {
      source = 'Tieteen termipankki'
    }
    if (uri.startsWith('http://fi.dbpedia.org/')) {
      source = 'Wikipedia'
    }
    if (source === 'Wikipedia') {
      return (
        <React.Fragment key={uri}>
          <p>
            <a href={externalLink} target='_blank' rel='noopener noreferrer'>
              {prefLabel.charAt(0).toUpperCase() + prefLabel.slice(1)} ({source})
            </a>
          </p>
          <p>{description}</p>
        </React.Fragment>
      )
    }
    if (source === 'Tieteen termipankki') {
      return (
        <React.Fragment key={uri}>
          <p>
            <a href={externalLink} target='_blank' rel='noopener noreferrer'>
              {prefLabel.charAt(0).toUpperCase() + prefLabel.slice(1)} ({source})
            </a>
          </p>
        </React.Fragment>
      )
    }
  }
}
