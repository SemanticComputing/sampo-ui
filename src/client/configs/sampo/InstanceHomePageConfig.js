export const getLocalIDFromAppLocation = ({ location, perspectiveConfig }) => {
  const locationArr = location.pathname.split('/')
  let localID = locationArr.pop()
  perspectiveConfig.instancePageTabs.forEach(tab => {
    if (localID === tab.id) {
      localID = locationArr.pop() // pop again if tab id
    }
  })
  return localID
}

export const createURIfromLocalID = ({ localID, perspectiveConfig }) => {
  let uri = ''
  const base = 'http://ldf.fi/mmm'
  const resultClass = perspectiveConfig.id
  switch (resultClass) {
    case 'perspective1':
      uri = `${base}/manifestation_singleton/${localID}`
      break
    case 'perspective2':
      uri = `${base}/work/${localID}`
      break
    case 'perspective3':
      uri = `${base}/event/${localID}`
      break
    case 'manuscripts':
      uri = `${base}/manifestation_singleton/${localID}`
      break
    case 'expressions':
      uri = `${base}/expression/${localID}`
      break
    case 'collections':
      uri = `${base}/collection/${localID}`
      break
    case 'works':
      uri = `${base}/work/${localID}`
      break
    case 'events':
      uri = `${base}/event/${localID}`
      break
    case 'actors':
      uri = `${base}/actor/${localID}`
      break
    case 'places':
      uri = `${base}/place/${localID}`
      break
  }
  return uri
}
