import {
  UPDATE_LOCALE
} from '../../actions'
import { availableLocales } from '../../epics/index.js'

const localeArray = []
for (const [key, value] of Object.entries(availableLocales)) {
  localeArray.push({ id: key, label: value.languageLabel })
}

export const INITIAL_STATE = {
  currentLocale: '',
  availableLocales: localeArray
}

const options = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case UPDATE_LOCALE:
      return {
        ...state,
        currentLocale: action.language
      }
    default:
      return state
  }
}

export default options
