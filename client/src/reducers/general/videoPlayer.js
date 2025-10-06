import { UPDATE_VIDEO_PLAYER_TIME } from '../../actions'

export const INITIAL_STATE = {
  videoPlayerTime: null
}

const videoPlayer = (state = INITIAL_STATE, action) => {
  if (action.type === UPDATE_VIDEO_PLAYER_TIME) {
    state = { ...state, videoPlayerTime: action.value }
  }
  return state
}

export default videoPlayer
