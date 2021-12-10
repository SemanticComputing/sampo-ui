import { has, orderBy } from 'lodash'
import history from '../../../History'
import intl from 'react-intl-universal'

export const createPopUpContentMMM = ({ data, resultClass }) => {
  if (Array.isArray(data.prefLabel)) {
    data.prefLabel = data.prefLabel[0]
  }
  const container = document.createElement('div')
  const h3 = document.createElement('h3')
  if (has(data.prefLabel, 'dataProviderUrl')) {
    const link = document.createElement('a')
    link.addEventListener('click', () => history.push(data.prefLabel.dataProviderUrl))
    link.textContent = data.prefLabel.prefLabel
    link.style.cssText = 'cursor: pointer; text-decoration: underline'
    h3.appendChild(link)
  } else {
    h3.textContent = data.prefLabel.prefLabel
  }
  container.appendChild(h3)
  if (resultClass === 'placesMsProduced') {
    const p = document.createElement('p')
    p.textContent = 'Manuscripts produced here:'
    container.appendChild(p)
    container.appendChild(createInstanceListing(data.related))
  }
  if (resultClass === 'lastKnownLocations') {
    const p = document.createElement('p')
    p.textContent = 'Last known location of:'
    container.appendChild(p)
    container.appendChild(createInstanceListing(data.related))
  }
  if (resultClass === 'placesActors') {
    const p = document.createElement('p')
    p.textContent = 'Actors:'
    container.appendChild(p)
    container.appendChild(createInstanceListing(data.related))
  }
  return container
}

export const createPopUpContentNameSampo = ({ data }) => {
  const perspectiveID = 'perspective4'
  let popUpTemplate = ''
  popUpTemplate += `<a href=${data.id} target='_blank'><h3>${data.prefLabel}</h3></a>`
  if (has(data, 'broaderTypeLabel')) {
    popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.broaderTypeLabel.label`)}</b>: ${data.broaderTypeLabel}</p>`
  }
  if (has(data, 'broaderAreaLabel')) {
    popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.broaderAreaLabel.label`)}</b>: ${data.broaderAreaLabel}</p>`
  }
  if (has(data, 'modifier')) {
    popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.modifier.label`)}</b>: ${data.modifier}</p>`
  }
  if (has(data, 'basicElement')) {
    popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.basicElement.label`)}</b>: ${data.basicElement}</p>`
  }
  if (has(data, 'collectionYear')) {
    popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.collectionYear.label`)}</b>: ${data.collectionYear}</p>`
  }
  if (has(data, 'source')) {
    if (data.namesArchiveLink !== '-') {
      popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.source.label`)}</b>:
        <a href="${data.namesArchiveLink}" target="_blank">${data.source}</a></p>`
    } else {
      popUpTemplate += `
      <p><b>${intl.get(`perspectives.${perspectiveID}.properties.source.label`)}</b>: ${data.source}</p>`
    }
  }
  return popUpTemplate
}

export const createPopUpContentFindSampo = data => {
  const container = document.createElement('div')

  if (has(data, 'image')) {
    let { image } = data
    if (Array.isArray(image)) {
      image = image[0]
    }
    const imageElement = document.createElement('img')
    imageElement.setAttribute('src', image.url)
    imageElement.style.cssText = 'width: 100%'
    container.appendChild(imageElement)
  }
  const heading = document.createElement('h3')
  const headingLink = document.createElement('a')
  headingLink.style.cssText = 'cursor: pointer; text-decoration: underline'
  headingLink.textContent = data.prefLabel.prefLabel
  headingLink.addEventListener('click', () => history.push(data.dataProviderUrl))
  heading.appendChild(headingLink)
  container.appendChild(heading)
  if (has(data, 'objectType')) {
    container.appendChild(this.createPopUpElement({
      label: intl.get('perspectives.finds.properties.objectType.label'),
      value: data.objectType.prefLabel
    }))
  }
  if (has(data, 'material')) {
    container.appendChild(this.createPopUpElement({
      label: intl.get('perspectives.finds.properties.material.label'),
      value: data.material.prefLabel
    }))
  }
  if (has(data, 'period')) {
    let periodLabel = ''
    if (Array.isArray(data.period)) {
      data.period.forEach((p, index) => {
        periodLabel += `${p.prefLabel}`
        if (index !== data.period.length - 1) {
          periodLabel += ', '
        }
      })
    } else {
      periodLabel = data.period.prefLabel
    }
    container.appendChild(createPopUpElement({
      label: intl.get('perspectives.finds.properties.period.label'),
      value: periodLabel
    }))
  }
  if (has(data, 'municipality')) {
    container.appendChild(createPopUpElement({
      label: intl.get('perspectives.finds.properties.municipality.label'),
      value: data.municipality.prefLabel
    }))
  }
  return container
}

const createPopUpElement = ({ label, value }) => {
  const p = document.createElement('p')
  const b = document.createElement('b')
  const span = document.createElement('span')
  b.textContent = (`${label}: `)
  span.textContent = value
  p.appendChild(b)
  p.appendChild(span)
  return p
}

const createInstanceListing = instances => {
  let root
  if (Array.isArray(instances)) {
    root = document.createElement('ul')
    instances = orderBy(instances, 'prefLabel')
    instances.forEach(i => {
      const li = document.createElement('li')
      const link = document.createElement('a')
      link.addEventListener('click', () => history.push(i.dataProviderUrl))
      link.textContent = i.prefLabel
      link.style.cssText = 'cursor: pointer; text-decoration: underline'
      li.appendChild(link)
      root.appendChild(li)
    })
  } else {
    root = document.createElement('p')
    const link = document.createElement('a')
    link.addEventListener('click', () => history.push(instances.dataProviderUrl))
    link.textContent = instances.prefLabel
    link.style.cssText = 'cursor: pointer; text-decoration: underline'
    root.appendChild(link)
  }
  return root
}

const createArchealogicalSitePopUp = data => {
  let html = ''
  const name = data.kohdenimi
    ? `<b>Nimi:</b> ${data.kohdenimi}</p>`
    : ''
  const classification = data.laji ? `<h3>${data.laji.charAt(0).toUpperCase() + data.laji.slice(1)}</b></h3>` : ''
  const municipality = data.kunta ? `<b>Kunta:</b> ${data.kunta}</p>` : ''
  const link = data.mjtunnus
    ? `<a href="https://www.kyppi.fi/to.aspx?id=112.${data.mjtunnus}" target="_blank">Avaa kohde Muinaisjäännösrekisterissä</a></p>`
    : ''
  html += `
    <div>
      ${classification}
      ${name}
      ${municipality}
      ${link}
    </div>
    `
  return html
}

const bufferStyle = feature => {
  if (feature.properties.laji.includes('poistettu kiinteä muinaisjäännös')) {
    return {
      fillOpacity: 0,
      weight: 0,
      interactive: false
    }
  } else {
    return {
      fillOpacity: 0,
      color: '#6E6E6E',
      dashArray: '3, 5',
      interactive: false
    }
  }
}

const createArchealogicalSiteColor = feature => {
  let color = '#dd2c00'
  if (feature.properties.laji.includes('poistettu kiinteä muinaisjäännös')) {
    color = '#000000'
  }
  return color
}

/*
  FHA spatial data general documentation:
    https://www.museovirasto.fi/en/services-and-guidelines/data-systems/kulttuuriympaeristoen-tietojaerjestelmae/kulttuuriympaeristoen-paikkatietoaineistot

  FHA WFS services:
    https://kartta.nba.fi/arcgis/rest/services/WFS/MV_KulttuuriymparistoSuojellut/MapServer
    https://kartta.nba.fi/arcgis/rest/services/WFS/MV_Kulttuuriymparisto/MapServer/

  MV_Kulttuuriymparisto service documentation:
    https://www.paikkatietohakemisto.fi/geonetwork/srv/fin/catalog.search#/metadata/83787bc0-5a11-4429-a79d-22b37360a408
    https://www.museovirasto.fi/uploads/Tietotuotemaarittely_kulttuuriymparisto_kaikki.pdf
  */
export const layerConfigs = [
  {
    // id: 'WFS_MV_KulttuuriymparistoSuojellut:Muinaisjaannokset_alue',
    id: 'WFS_MV_Kulttuuriymparisto:Arkeologiset_kohteet_alue',
    type: 'GeoJSON',
    attribution: 'Museovirasto',
    minZoom: 13,
    buffer: {
      distance: 200,
      units: 'metres',
      style: bufferStyle
    },
    createGeoJSONPolygonStyle: feature => {
      return {
        color: createArchealogicalSiteColor(feature),
        cursor: 'pointer'
      }
    },
    createPopup: createArchealogicalSitePopUp
  },
  {
    // id: 'WFS_MV_KulttuuriymparistoSuojellut:Muinaisjaannokset_piste',
    id: 'WFS_MV_Kulttuuriymparisto:Arkeologiset_kohteet_piste',
    type: 'GeoJSON',
    attribution: 'Museovirasto',
    minZoom: 13,
    buffer: {
      distance: 200,
      units: 'metres',
      style: bufferStyle
    },
    createGeoJSONPointStyle: feature => {
      return {
        radius: 8,
        fillColor: createArchealogicalSiteColor(feature),
        color: '#000',
        weight: 1,
        opacity: 1,
        fillOpacity: 0.8
      }
    },
    createPopup: createArchealogicalSitePopUp
  },
  // {
  //   id: 'fhaLidar',
  //   type: 'WMS',
  //   url: `${process.env.API_URL}/fha-wms`,
  //   layers: 'NBA:lidar',
  //   version: '1.3.0',
  //   attribution: 'Museovirasto',
  //   minZoom: 13,
  //   maxZoom: 18
  // },
  {
    id: 'karelianMaps',
    type: 'WMTS',
    url: 'https:///mapwarper.onki.fi/mosaics/tile/4/{z}/{x}/{y}.png',
    opacityControl: true,
    attribution: 'Semantic Computing Research Group'
  },
  {
    id: 'senateAtlas',
    type: 'WMTS',
    url: 'https:///mapwarper.onki.fi/mosaics/tile/5/{z}/{x}/{y}.png',
    opacityControl: true,
    attribution: 'Semantic Computing Research Group'
  }
]
