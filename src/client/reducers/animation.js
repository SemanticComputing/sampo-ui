import { ANIMATE_MAP } from '../actions'

export const INITIAL_STATE = {
  value: [131]
}

const animation = (state = INITIAL_STATE, action) => {
  if (action.type === ANIMATE_MAP) {
    state = { ...state, value: action.value }
  }
  return state
}

export default animation
