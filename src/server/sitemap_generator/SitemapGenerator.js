import { backendSearchConfig } from '../sparql/sampo/BackendSearchConfig'
import { createWriteStream } from 'fs'
import { resolve } from 'path'
import { createGzip } from 'zlib'
import { has } from 'lodash'
import {
  SitemapAndIndexStream,
  SitemapStream
} from 'sitemap'
import { runSelectQuery } from '../sparql/SparqlApi'

const { sitemapConfig } = backendSearchConfig

const mapURLs = sparqlBindings => {
  const results = sparqlBindings.map(b => {
    return createSitemapEntry({ path: b.path.value })
  })
  return results
}

const getURLs = async resultClasses => {
  const sitemapStream = new SitemapAndIndexStream({
    limit: 10000, // defaults to 45k
    // SitemapAndIndexStream will call this user provided function every time
    // it needs to create a new sitemap file. You merely need to return a stream
    // for it to write the sitemap urls to and the expected url where that sitemap will be hosted
    getSitemapStream: index => {
      const sitemapStream = new SitemapStream({ hostname: sitemapConfig.baseUrl })
      const fileName = `sitemap-${index}.xml.gz`

      sitemapStream
        .pipe(createGzip()) // compress the output
        .pipe(createWriteStream(resolve(`${sitemapConfig.outputDir}/${fileName}`))) // write it to sitemap-NUMBER.xml.gz

      return [`${sitemapConfig.sitemapUrl}/${fileName}`, sitemapStream]
    }
  })

  sitemapStream
    .pipe(createGzip()) // compress the output
    .pipe(createWriteStream(resolve(`${sitemapConfig.outputDir}/sitemap-index.xml.gz`))) // write it to sitemap-index.xml.gz

  // Add portal's main level URLs to sitemap
  sitemapStream.write(createSitemapEntry({ path: null }))
  sitemapStream.write(createSitemapEntry({ path: 'about' }))
  sitemapStream.write(createSitemapEntry({ path: 'instructions' }))
  sitemapStream.write(createSitemapEntry({ path: 'feedback' }))

  // Then process each resultClass
  for (const resultClass of resultClasses) {
    if (resultClass.hasSearchPerspective) {
      // If there is a search perspective, add it's URL to sitemap
      const searchMode = resultClass.searchMode ? resultClass.searchMode : 'faceted-search'
      sitemapStream.write(createSitemapEntry({ path: `${resultClass.perspectiveID}/${searchMode}/table` }))
    }
    const response = await queryInstancePageURLs(resultClass)
    // Add instance page URLs to sitemap
    response.data.forEach(item => sitemapStream.write(item))
  }

  sitemapStream.end()
}

const queryInstancePageURLs = config => {
  const { endpoint } = config
  let q = sitemapConfig.sitemapInstancePageQuery.replace('<RESULT_CLASS>', config.rdfType)
  q = q.replace('<PERSPECTIVE>', config.perspectiveID)
  q = q.replace('<DEFAULT_TAB>', config.instancePageDefaultTab)
  return runSelectQuery({
    query: endpoint.prefixes + q,
    endpoint: endpoint.url,
    useAuth: endpoint.useAuth,
    resultMapper: mapURLs,
    resultFormat: 'json'
  })
}

const resultClasses = []

for (let [resultClass, config] of Object.entries(backendSearchConfig)) {
  if (config.includeInSitemap) {
    let rdfType
    let hasSearchPerspective
    const instancePageDefaultTab = config.instance.defaultTab || 'table'
    if (!has(config, 'facetClass')) {
      rdfType = config.rdfType
      config = backendSearchConfig[config.perspectiveID]
      hasSearchPerspective = false
    } else {
      rdfType = config.facetClass
      hasSearchPerspective = true
    }
    resultClasses.push({
      endpoint: config.endpoint,
      perspectiveID: resultClass,
      hasSearchPerspective,
      rdfType,
      instancePageDefaultTab
    })
  }
}

const createSitemapEntry = ({ path }) => {
  path = path ? `/${path}` : '' // do not add trailing slash
  const entry = {
    url: `${sitemapConfig.baseUrl}/${sitemapConfig.langPrimary}${path}`,
    links: [
      { lang: sitemapConfig.langPrimary, url: `${sitemapConfig.baseUrl}/${sitemapConfig.langPrimary}${path}` },
      { lang: sitemapConfig.langSecondary, url: `${sitemapConfig.baseUrl}/${sitemapConfig.langSecondary}${path}` }
    ]
  }
  return entry
}

getURLs(resultClasses)
