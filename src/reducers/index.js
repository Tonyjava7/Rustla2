import omit from 'lodash/omit';

import INITIAL_STATE from '../INITIAL_STATE';
import { actions as websocket_actions } from '../actions/websocket';


function rootReducer(state, action) {
  if (!state) {
    return INITIAL_STATE;
  }
  switch (action.type) {
    case websocket_actions.STREAM_GET: {
      const [ stream ] = action.payload;
      return {
        streams: {
          ...state.streams,
          [stream.id]: stream,
        },
      };
    }
    case websocket_actions.STREAM_SET: {
      const [ stream ] = action.payload;
      return {
        ...state,
        stream: stream.id,
        streams: {
          ...state.streams,
          [stream.id]: stream,
        },
      };
    }
    case websocket_actions.RUSTLERS_SET: {
      const [ id, rustlers ] = action.payload;
      // flush this guy if no one is watching him
      if (rustlers === 0) {
        return {
          ...state,
          streams: omit(state.streams, [id]),
        };
      }
      return {
        ...state,
        streams: {
          ...state.streams,
          [id]: {
            ...state.streams[id],
            id,
            rustlers,
          },
        },
      };
    }
    case websocket_actions.STREAMS_SET: {
      const [ streams ] = action.payload;
      return {
        ...state,
        streams: {
          ...streams.reduce((acc, stream) => {
            acc[stream.id] = stream;
            return acc;
          }, {}),
        },
      };
    }
  }
  return state;
}

export default rootReducer;
