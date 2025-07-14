export const ADD_PEER_STREAM = "ADD_PEER_STREAM";
export const REMOVE_PEER_STREAM = "REMOVE_PEER_STREAM";
export const RESET_PEERS = "RESET_PEERS";
export const ADD_PEER_NAME = "ADD_PEER_NAME";

export const resetPeersAction = () => ({
    type: RESET_PEERS,
});

export const addPeerNameAction = (peerId, uName) => ({
    type: ADD_PEER_NAME,
    payload: { peerId, uName },
});

export const addPeerAction = (peerId, stream, dataConnection, uName) => ({
    type: ADD_PEER_STREAM,
    payload: { peerId, stream, dataConnection, uName }
})
export const removePeerAction = (peerId) => ({
    type: REMOVE_PEER_STREAM,
    payload: { peerId }
})