import {
    ADD_PEER_STREAM,
    REMOVE_PEER_STREAM,
    RESET_PEERS,
    ADD_PEER_NAME,
    // ADD_ALL_PEERS,
} from "./PeerActions";

export const peersReducer = (state, action) => {
    switch (action.type) {
        case ADD_PEER_STREAM:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    stream: action.payload.stream,
                },
            };
        case ADD_PEER_NAME:
            return {
                ...state,
                [action.payload.peerId]: {
                    ...state[action.payload.peerId],
                    uName: action.payload.uName,
                },
            };
        case REMOVE_PEER_STREAM:
            const { [action.payload.peerId]: _, ...newState } = state;
            return newState;
        // case ADD_ALL_PEERS:
        //     return { ...state, ...action.payload.peers };
        case RESET_PEERS:
            return {}
        default:
            return { ...state };
    }
};
