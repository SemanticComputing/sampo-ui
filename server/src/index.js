import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import axios from 'axios'
import fs from 'fs'
import { has, castArray } from 'lodash'
import { createBackendSearchConfig } from './sparql/Utils'
import {
  getResultCount,
  getPaginatedResults,
  getAllResults,
  getByURI
} from './sparql/FacetResults'
import { getFacet } from './sparql/FacetValues'
import { queryJenaIndex } from './sparql/JenaQuery'
import { getFederatedResults } from './sparql/FederatedSearch'
import { fetchGeoJSONLayer } from './wfs/WFSApi'
import swaggerUi from 'swagger-ui-express'
import * as OpenApiValidator from 'express-openapi-validator'
import yaml from 'js-yaml'
import querystring from 'querystring'

createBackendSearchConfig().then(backendSearchConfig => {
  const DEFAULT_PORT = 3001
  const app = express()
  app.set('port', process.env.SAMPO_UI_EXPRESS_PORT || DEFAULT_PORT)
  app.use(bodyParser.json())
  app.disable('x-powered-by')

  // CORS middleware
  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    // handle pre-flight request
    if (req.method === 'OPTIONS') {
      return res.status(200).end()
    }
    next()
  })

  // ==============================================
  // STATIC FILES - serve before API routes: static files include frontend React app files
  // ==============================================
  const staticPath = process.env.STATIC_PATH || path.join(__dirname, '../../public')
  
  // Serve static files (JS, CSS, images, etc.)
  app.use(express.static(staticPath, {
    // Optional: cache static assets for 1 year in production
    maxAge: process.env.NODE_ENV === 'production' ? '1y' : 0,
    index: ["index.html"]  // Don't serve index.html automatically, we handle SPA routing below
  }))

  // ==============================================
  // API ROUTES - all /api/* requests handled here
  // ==============================================

  // Generate API docs from YAML file with Swagger UI
  let swaggerDocument
  try {
    swaggerDocument = yaml.safeLoad(fs.readFileSync(path.join(__dirname, './openapi.yaml'), 'utf8'))
  } catch (e) {
    console.log(e)
  }
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

  // React app makes requests to these api urls
  const apiPath = '/api/v1'

  // Serve the configs directory at /configs
  const configsPath = '/app/configs'
  app.use(`${apiPath}/configs`, async (req, res, next) => {
    const filePath = path.join(configsPath, req.path)
    try {
      const stats = await fs.promises.stat(filePath)
      if (stats.isFile()) {
        return express.static(configsPath)(req, res, next)
      } else {
        console.log(`Requested path is not a file: ${filePath}`)
        next()
      }
    } catch (err) {
      console.log(`File not found or inaccessible: ${filePath}`)
      console.error(`Error accessing ${filePath}:`, err.message)
      next()
    }
  })

  const validator = OpenApiValidator.middleware({
    apiSpec: swaggerDocument,
    validateResponses: true
  })
  app.use(validator)

  // https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
  app.post(`${apiPath}/faceted-search/:resultClass/paginated`, async (req, res, next) => {
    const { params, body } = req
    try {
      const data = await getPaginatedResults({
        backendSearchConfig,
        resultClass: params.resultClass,
        page: body.page,
        pagesize: parseInt(body.pagesize),
        sortBy: body.sortBy,
        sortDirection: body.sortDirection,
        constraints: body.constraints,
        resultFormat: 'json',
        dynamicLangTag: body.langTag
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.post(`${apiPath}/faceted-search/:resultClass/all`, async (req, res, next) => {
    const { params, body } = req
    const resultFormat = 'json'
    try {
      const data = await getAllResults({
        backendSearchConfig,
        perspectiveID: body.perspectiveID,
        resultClass: params.resultClass,
        facetClass: body.facetClass,
        uri: body.uri,
        constraints: body.constraints,
        resultFormat,
        limit: body.limit,
        optimize: body.optimize,
        fromID: body.fromID,
        toID: body.toID,
        period: body.period,
        province: body.province,
        dynamicLangTag: body.langTag
      })
      if (resultFormat === 'csv') {
        res.writeHead(200, {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=results.csv'
        })
        res.end(data)
      } else {
        res.json(data)
      }
    } catch (error) {
      next(error)
    }
  })

  // GET endpoint for supporting CSV button
  app.get(`${apiPath}/faceted-search/:resultClass/all`, async (req, res, next) => {
    try {
      const resultFormat = req.query.resultFormat == null ? 'json' : req.query.resultFormat
      const data = await getAllResults({
        backendSearchConfig,
        perspectiveID: req.body.perspectiveID,
        resultClass: req.params.resultClass,
        facetClass: req.query.facetClass || null,
        constraints: req.query.constraints == null ? null : req.query.constraints,
        resultFormat,
        dynamicLangTag: req.body.langTag
      })
      if (resultFormat === 'csv') {
        res.writeHead(200, {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=results.csv'
        })
        res.end(data)
      } else {
        res.json(data)
      }
    } catch (error) {
      next(error)
    }
  })

  app.post(`${apiPath}/faceted-search/:resultClass/count`, async (req, res, next) => {
    const { params, body } = req
    try {
      const data = await getResultCount({
        backendSearchConfig,
        resultClass: params.resultClass,
        constraints: body.constraints,
        resultFormat: 'json'
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.post(`${apiPath}/:resultClass/page/:uri`, async (req, res, next) => {
    const { params, body } = req
    try {
      const data = await getByURI({
        backendSearchConfig,
        perspectiveID: body.perspectiveID,
        resultClass: params.resultClass,
        uri: params.uri,
        facetClass: body.facetClass,
        constraints: body.constraints,
        resultFormat: 'json',
        dynamicLangTag: body.langTag
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.post(`${apiPath}/faceted-search/:facetClass/facet/:id`, async (req, res, next) => {
    const { params, body } = req
    try {
      const data = await getFacet({
        backendSearchConfig,
        facetClass: params.facetClass,
        facetID: params.id,
        sortBy: body.sortBy,
        sortDirection: body.sortDirection,
        constraints: body.constraints,
        resultFormat: 'json',
        constrainSelf: body.constrainSelf,
        dynamicLangTag: body.langTag
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.get(`${apiPath}/full-text-search`, async (req, res, next) => {
    try {
      const data = await queryJenaIndex({
        backendSearchConfig,
        queryTerm: req.query.q,
        resultClass: 'fullTextSearch',
        resultFormat: 'json'
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.get(`${apiPath}/federated-search`, async (req, res, next) => {
    const perspectiveID = req.query.perspectiveID
    let queryTerm = ''
    let latMin = 0
    let longMin = 0
    let latMax = 0
    let longMax = 0
    if (has(req.query, 'q')) {
      queryTerm = req.query.q
    }
    if (has(req.query, 'latMin')) {
      latMin = req.query.latMin
      longMin = req.query.longMin
      latMax = req.query.latMax
      longMax = req.query.longMax
    }
    try {
      const data = await getFederatedResults({
        perspectiveID,
        federatedSearchDatasets: backendSearchConfig[perspectiveID].datasets,
        queryTerm,
        latMin,
        longMin,
        latMax,
        longMax,
        datasets: castArray(req.query.dataset),
        resultFormat: req.query.resultFormat == null ? 'json' : req.query.resultFormat
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.get(`${apiPath}/wfs`, async (req, res, next) => {
    const layerIDs = castArray(req.query.layerID)
    try {
      const data = await Promise.all(layerIDs.map(layerID => fetchGeoJSONLayer({ layerID })))
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  // https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts
  app.get(`${apiPath}/nls-wmts`, async (req, res, next) => {
    const url = `https://karttakuva.maanmittauslaitos.fi/maasto/wmts/1.0.0/${req.query.layerID}/default/WGS84_Pseudo-Mercator/${req.query.z}/${req.query.y}/${req.query.x}.png`
    const headers = {
      'Content-Type': 'image/png',
      Authorization: `Basic ${process.env.NLS_WMTS_BASIC_AUTH}`
    }
    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
        headers
      })
      res.end(response.data, 'base64')
    } catch (error) {
      next(error)
    }
  })

  // https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-wmts
  app.get(`${apiPath}/nls-wmts-open`, async (req, res, next) => {
    const url = `https://avoin-karttakuva.maanmittauslaitos.fi/avoin/wmts/1.0.0/${req.query.layerID}/default/WGS84_Pseudo-Mercator/${req.query.z}/${req.query.y}/${req.query.x}.png`
    const headers = {
      'Content-Type': 'image/png',
      Authorization: `Basic ${process.env.NLS_API_KEY_BASE64}`
    }
    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
        headers
      })
      res.end(response.data, 'base64')
    } catch (error) {
      next(error)
    }
  })

  // // https://www.maanmittauslaitos.fi/karttakuvapalvelu/tekninen-kuvaus-vektoritiilet
  app.get(`${apiPath}/nls-vectortiles-open`, async (req, res, next) => {
    const url = 'https://avoin-karttakuva.maanmittauslaitos.fi/vectortiles/stylejson/v20/taustakartta.json?TileMatrixSet=WGS84_Pseudo-Mercator'
    const headers = {
      Authorization: `Basic ${process.env.NLS_API_KEY_BASE64}`
    }
    try {
      const response = await axios({
        method: 'get',
        url,
        headers
      })
      res.json(response.data)
    } catch (error) {
      next(error)
    }
  })

  app.get(`${apiPath}/fha-wms`, async (req, res, next) => {
    const headers = {
      Authorization: `Basic ${process.env.FHA_WMS_BASIC_AUTH}`
    }
    const { service, request, layers, styles, format, transparent, version, width, height, crs, bbox } = req.query
    const mapServerParams = {
      service,
      request,
      layers,
      styles,
      format,
      transparent,
      version,
      width,
      height,
      crs,
      bbox
    }
    const url = `http://137.116.207.73/geoserver/ows?${querystring.stringify(mapServerParams)}`
    try {
      const response = await axios({
        method: 'get',
        url,
        responseType: 'arraybuffer',
        headers
      })
      res.end(response.data, 'base64')
    } catch (error) {
      console.log(error)
      next(error)
    }
  })

  app.get(`${apiPath}/wfs`, async (req, res, next) => {
    const layerIDs = castArray(req.query.layerID)
    try {
      const data = await Promise.all(layerIDs.map(layerID => fetchGeoJSONLayer({ layerID })))
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  app.get(`${apiPath}/void/:perspectiveID/:resultClass`, async (req, res, next) => {
    const { params } = req
    try {
      const data = await getAllResults({
        backendSearchConfig,
        perspectiveID: params.perspectiveID,
        resultClass: params.resultClass,
        resultFormat: 'json'
      })
      res.json(data)
    } catch (error) {
      next(error)
    }
  })

  const isDevelopment = process.env.NODE_ENV !== 'production'
  // Express server is used to serve the React app only in production
  if (!isDevelopment) {
     /*  Routes are matched to a url in order of their definition
         Redirect all the the rest for react-router to handle */
     app.get('*', function (request, response) {
      response.sendFile(path.resolve(__dirname, '../../public/index.html'))
    })
  }

  // const servingInfo = isDevelopment
  //   ? 'NODE_ENV=development, so Webpack serves the React app'
  //   : `Static files (e.g. the React app) will be served from ${publicPath}`

  const port = app.get('port')

  app.listen(port, () =>
    console.log(`
          Express server listening on port ${port}
          API path is ${apiPath}
        `)
  )
})
