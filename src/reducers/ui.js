import INITIAL_STATE from '../INITIAL_STATE';
import { SET_CHAT_SIZE, TOGGLE_CHAT, SHOW_CHAT } from '../actions';


function uiReducer(state = INITIAL_STATE.ui, action) {
  switch (action.type) {
    case SET_CHAT_SIZE:
      return {
        ...state,
        chatSize: action.payload,
      };
    case TOGGLE_CHAT:
      return {
        ...state,
        chatHost: action.payload,
        // Might be better to add this conditionally based on current state to avoid re-renders
        showChat: true,
      };
    case SHOW_CHAT:
      return {
        ...state,
        showChat: action.payload,
      };
    default:
      return state;
  }
}

export default uiReducer;
