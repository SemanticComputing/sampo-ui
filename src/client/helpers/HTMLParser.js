import ReactHtmlParser from 'react-html-parser'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'

export default class HTMLParser {
  constructor (props) {
    this.props = props
  }

  parseHTML (html) {
    let transform
    switch (this.props.HTMLParserTask) {
      case 'addReactRouterLinks':
        transform = this.addReactRouterLinks
        break
      case 'addAnnotationTooltips':
        transform = this.addAnnotationTooltips
        break
      default:
        transform = null
    }
    return ReactHtmlParser(html, { transform })
  }

  addReactRouterLinks (node, index) {
    if (node.type === 'tag' && node.name === 'a') {
      const href = node.attribs.href
      const text = node.children[0].data
      return <Link key={index} to={href}>{text}</Link>
    }
  }

  addAnnotationTooltips = (node, index) => {
    const props = this.props
    if (node.type === 'tag' && node.name === 'span' && node.attribs.name === 'namedentity' && node.attribs['data-link'] !== '') {
      const linkStr = node.attribs['data-link']
      const occurrenceID = node.attribs['data-occurrence-id']
      let tooltipJSX
      if (linkStr.includes(',')) {
        const uris = linkStr.split(',')
        const listItemsJSX = []
        uris.map((uri, index) => {
          listItemsJSX.push(
            <li key={index}>
              <ul>
                {this.renderAnnotation(uri)}
              </ul>
            </li>
          )
        })
        tooltipJSX = (
          <div className={props.classes.tooltipContent}>
            <ol className={props.classes.tooltipList}>{listItemsJSX}</ol>
          </div>
        )
      } else {
        const uri = linkStr
        tooltipJSX = (
          <div className={props.classes.tooltipContent}>
            <ul className={props.classes.tooltipList}>
              {this.renderAnnotation(uri)}
            </ul>
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
          key={occurrenceID}
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

  renderAnnotation = uri => {
    const props = this.props
    if (uri.startsWith('http://ldf.fi/ttp/')) {
      const localID = uri.replace('http://ldf.fi/ttp/', '')
      uri = `http://ldf.fi/ttp/${encodeURIComponent(localID)}`
    }
    return (
      <>
        <li><i><small>URI:</small></i> <a href={uri} target='_blank' rel='noopener noreferrer'>{props.annotationData[uri].id}</a></li>
        <li><i><small>dctems:hasFormat:</small></i> <a href={props.annotationData[uri].format} target='_blank' rel='noopener noreferrer'>{props.annotationData[uri].format}</a></li>
        <li><i><small>skos:prefLabel:</small></i> {props.annotationData[uri].prefLabel}</li>
        <li><i><small>rdfs:comment:</small></i> {props.annotationData[uri].comment}</li>
      </>
    )
  }
}
