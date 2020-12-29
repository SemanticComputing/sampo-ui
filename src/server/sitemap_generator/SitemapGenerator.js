import { backendSearchConfig } from '../sparql/sampo/BackendSearchConfig'
import { createWriteStream } from 'fs'
import { resolve } from 'path'
import { createGzip } from 'zlib'
// import { Readable } from 'stream'
import { has } from 'lodash'
import {
  SitemapAndIndexStream,
  SitemapStream
} from 'sitemap'
import { sitemapQuery } from '../sparql/SparqlQueriesGeneral'
import { runSelectQuery } from '../sparql/SparqlApi'

const outputDir = './src/server/sitemap_generator/sitemap_output'
const baseURL = 'https://sampo-ui.demo.seco.cs.aalto.fi/en'
const sitemapURL = 'https://sampo-ui.demo.seco.cs.aalto.fi/sitemap'

const mapURLs = sparqlBindings => {
  const results = sparqlBindings.map(b => ({
    url: b.url.value
  }))
  return results
}

const getURLs = async resultClasses => {
  const sitemapStream = new SitemapAndIndexStream({
    limit: 10000, // defaults to 45k
    // SitemapAndIndexStream will call this user provided function every time
    // it needs to create a new sitemap file. You merely need to return a stream
    // for it to write the sitemap urls to and the expected url where that sitemap will be hosted
    getSitemapStream: index => {
      const sitemapStream = new SitemapStream({ hostname: baseURL })
      const fileName = `sitemap-${index}.xml.gz`

      sitemapStream
        .pipe(createGzip()) // compress the output
        .pipe(createWriteStream(resolve(`${outputDir}/${fileName}`))) // write it to sitemap-NUMBER.xml.gz

      return [`${sitemapURL}/${fileName}`, sitemapStream]
    }
  })

  sitemapStream
    .pipe(createGzip()) // compress the output
    .pipe(createWriteStream(resolve(`${outputDir}/sitemap-index.xml.gz`))) // write it to sitemap-index.xml.gz

  // Add portal's main level URLs to sitemap
  sitemapStream.write({ url: baseURL })
  sitemapStream.write({ url: `${baseURL}/about` })
  sitemapStream.write({ url: `${baseURL}/instructions` })
  sitemapStream.write({ url: `${baseURL}/feedback` })

  // Then process each resultClass
  for (const resultClass of resultClasses) {
    if (resultClass.hasSearchPerspective) {
      // If there is a search perspective, add it's URL to sitemap
      const searchMode = resultClass.searchMode ? resultClass.searchMode : 'faceted-search'
      sitemapStream.write({
        url: `${baseURL}/${resultClass.perspectiveID}/${searchMode}`
      })
    }
    const response = await queryInstancePageURLs(resultClass)
    // Add instance page URLs to sitemap
    response.data.forEach(item => sitemapStream.write(item))
  }

  sitemapStream.end()
}

const queryInstancePageURLs = config => {
  const { endpoint } = config
  let q = sitemapQuery.replace('<RESULT_CLASS>', config.rdfType)
  q = q.replace('<PERSPECTIVE>', config.perspectiveID)
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
      rdfType
    })
  }
}

getURLs(resultClasses)
