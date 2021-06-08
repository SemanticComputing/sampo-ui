import bannerImage from '../../img/main_page/mmm-banner.jpg'

export const rootUrl = ''

export const defaultLocale = 'en'

export const readTranslationsFromGoogleSheets = false

export const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoiZWtrb25lbiIsImEiOiJja2FkbGxiY2owMDZkMnFxcGVqNTZ0dmk2In0.6keLTN8VveJkM5y4_OFmUw' // https://docs.mapbox.com/accounts/overview/tokens/

export const MAPBOX_STYLE = 'light-v10' // https://docs.mapbox.com/api/maps/#styles

export const documentFinderAPIUrl = 'https://data.finlex.fi/document-finder-backend'

export const yasguiBaseUrl = 'https://yasgui.triply.cc'

export const yasguiParams = {
  contentTypeConstruct: 'text/turtle',
  contentTypeSelect: 'application/sparql-results+json',
  endpoint: 'http://ldf.fi/mmm/sparql',
  requestMethod: 'POST',
  tabTitle: 'Exported query'
}

export const SLIDER_DURATION = {
  halfSpeed: 1200,
  normalSpeed: 600,
  doubleSpeed: 300
}

export const layoutConfig = {
  hundredPercentHeightBreakPoint: 'md',
  reducedHeightBreakpoint: 'lg',
  tabHeight: 58,
  paginationToolbarHeight: 37,
  tableFontSize: '0.8rem',
  topBar: {
    showLanguageButton: true,
    feedbackLink: 'https://link.webropolsurveys.com/',
    reducedHeight: 44,
    defaultHeight: 64,
    mobileMenuBreakpoint: 1360
  },
  mainPage: {
    bannerBackround: `linear-gradient( rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45) ), url(${bannerImage})`,
    bannerDefaultHeight: 300,
    bannerReducedHeight: 220
  },
  infoHeader: {
    default: {
      height: 49,
      expandedContentHeight: 160,
      headingVariant: 'h4',
      infoIconFontSize: 40
    },
    reducedHeight: {
      height: 40,
      expandedContentHeight: 100,
      headingVariant: 'h6',
      infoIconFontSize: 32
    }
  },
  footer: {
    height: 64
  }
}
