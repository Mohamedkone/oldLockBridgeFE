import { createContext, useEffect, useState, useReducer, useContext } from "react";
import Peer from "peerjs";
import { peersReducer } from "./PeerReducer";
import { addPeerAction, addPeerNameAction, removePeerAction, resetPeersAction } from "./PeerActions";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { WSContext } from "./socket/wsContext";

export const RoomContext = createContext(null);

export const RoomProvider = ({ children }) => {
    const CHUNK_SIZE = 700 * 1024; // 16 KB, adjust based on your needs
    const { ws } = useContext(WSContext)
    const [isReceivingFile, setIsReceivingFile] = useState(false);
    const [me, setMe] = useState();
    const { myInfo, api } = useContext(AuthContext);
    const [peers, dispatch] = useReducer(peersReducer, {});
    const [roomId, setRoomId] = useState("");
    const [parti, setParti] = useState([]);
    const [thisAdmin, setThisAdmin] = useState("");
    const [thisRoomActions, setThisRoomActions] = useState();
    const [fileTransferProgress, setFileTransferProgress] = useState({});
    const [receivingFiles, setReceivingFiles] = useState({});
    const [roomLock, setRoomLock] = useState(null);
    const [peerInitialized, setPeerInitialized] = useState(false);
    const [sendState, setSendState] = useState(true)

    let incomingFiles = {};

    const getUsers = ({ participants, peerId, admin, locked, roomActions }) => {
        const uName = `${myInfo?.fname} ${myInfo?.lname}`;
        setRoomLock(() => locked);
        setThisAdmin(() => admin);
        setParti(() => participants);
        setThisRoomActions(() => roomActions);
        console.log(participants)
        participants.forEach((m) => {
            if (peerId !== m) {
                const dataConnection = me?.connect(m, { metadata: { username: uName } });
                dispatch(addPeerAction(m, dataConnection));
            }
        });
    };

    const removePeer = (peerId) => {
        dispatch(removePeerAction(peerId));
    };

    const resetPeer = () => {
        dispatch(resetPeersAction());
    };

    let tempFileTransferProgress = {};
    const shouldUpdateSendState = (fileId, currentProgress) => {
        const lastProgress = tempFileTransferProgress[fileId] || 0;
        const progressDifference = currentProgress - lastProgress;
        if (progressDifference >= 1 || currentProgress === 100) {
            tempFileTransferProgress[fileId] = currentProgress;
            return true;
        }
        return false;
    };

    const sendFile = (dataConnection, file, uName) => {
        const fileId = `${file.name}-${Date.now()}`;
        const logId = crypto.randomUUID();
        const date = new Date();
        axios.post(`${api}/logs`, {
            logId: logId,
            senderEmail: `${myInfo?.fname} ${myInfo?.lname}`,
            fileName: file.name,
            size: file.size,
            type: `${file.type}`,
            date: `${date.getUTCFullYear()}-${date.getUTCMonth()+1}-${date.getUTCDate()}`,
            receiver: uName,
            companyId: myInfo?.company,
        })
        const metadata = {
            type: 'metadata',
            name: file.name,
            size: file.size,
            fileType: file.type,
            logId: logId,
            id: fileId,
            sender: myInfo?.id
        };

        dataConnection.send(metadata);

        const fileReader = new FileReader();
        let offset = 0;

        fileReader.onload = (e) => {
            if (!e.target.result) {
                return;
            }
            dataConnection.send({
                type: 'file-chunk',
                id: metadata.id,
                chunk: e.target.result,
                offset
            });
            offset += e.target.result.byteLength;

            const progress = (offset / file.size) * 100;
            if (shouldUpdateSendState(fileId, progress)) {
                setFileTransferProgress(prev => ({ ...prev, [fileId]: progress }));
            }

            if (offset < file.size) {
                readSlice(offset);
            } else {
                setFileTransferProgress(prev => ({ ...prev, [fileId]: 100 }));
                delete tempFileTransferProgress[fileId];
            }
        };

        const readSlice = o => {
            const slice = file.slice(o, o + CHUNK_SIZE);
            fileReader.readAsArrayBuffer(slice);
        };

        readSlice(0);
    };

    const cleanFile = (files) => {
        if (isReceivingFile) return false;
        Object.values(peers).forEach(dataConnection => {
            if (dataConnection && dataConnection.stream._open) {
                if (files.length) {
                    for (let i = 0; i < files.length; i++) {
                        sendFile(dataConnection.stream, files[i], dataConnection.uName);
                    }
                } else if (files) {
                    sendFile(dataConnection.stream, files, dataConnection.uName);
                }
                else return false
            }else return false
        });
        return true
    };

    let tempReceivingFiles = {};
    const shouldUpdateState = (fileData) => {
        const progressIncrement = 1;
        const currentProgress = (fileData.receivedBytes / fileData.size) * 100;
        const lastProgress = tempReceivingFiles[fileData.id]?.progress || 0;

        return (currentProgress - lastProgress) >= progressIncrement;
    };

    useEffect(() => {
        if (!myInfo && peerInitialized) return
        const peer = new Peer(myInfo.id, {
            host: process.env.REACT_APP_PEER_HOST,
            port: process.env.REACT_APP_PEER_PORT,
            path: "/peer",
            secure: process.env.REACT_APP_PEER_SECURE === "true",

            config: {
                iceServers: [
                    {
                        urls: "turn:turn.lockbridge.io:3478",
                        username: "username",
                        credential: "password"
                    },
                    {
                        urls: "stun:stun.l.google.com:19302"
                    }
                ]
            }
        });
        peer.on('error', function (err) {
            console.error('Peer error:', err);
        });
        peer.on('connection', (conn) => {
            dispatch(addPeerNameAction(conn.peer, conn.metadata.username));
        
            conn.on('open', () => {
                conn.send("thanks for the connection");
                Object.keys(peers).forEach((existingPeerId) => {
                    if (existingPeerId !== conn.peer) {
                        conn.send({
                            type: 'peer-info',
                            peerId: existingPeerId,
                            username: peers[existingPeerId].username,
                        });
                    }
                });
            });
        
            conn.on('data', (data) => {
                if (data.type === 'peer-info') {
                    dispatch(addPeerNameAction(data.peerId, data.username));
                } else if (data.type === 'metadata') {
                    setIsReceivingFile(true);
                    incomingFiles[data.id] = {
                        ...data,
                        chunks: [],
                        receivedBytes: 0
                    };
                    setReceivingFiles(prev => ({
                        ...prev,
                        [data.id]: { name: data.name, size: data.size, receivedBytes: 0, progress: 0 }
                    }));
                } else if (data.type === 'file-chunk') {
                    const fileData = incomingFiles[data.id];
                    if (fileData) {
                        fileData.chunks.push(new Uint8Array(data.chunk));
                        fileData.receivedBytes += data.chunk.byteLength;
                        const progress = (fileData.receivedBytes / fileData.size) * 100;
        
                        if (shouldUpdateState(fileData)) {
                            setReceivingFiles(prev => ({
                                ...prev,
                                [data.id]: { ...prev[data.id], receivedBytes: fileData.receivedBytes, progress }
                            }));
        
                            tempReceivingFiles[data.id] = { ...tempReceivingFiles[data.id], progress };
                        }
        
                        if (fileData.receivedBytes === fileData.size) {
                            setReceivingFiles(prev => ({
                                ...prev,
                                [data.id]: { ...prev[data.id], receivedBytes: fileData.receivedBytes, progress: 100, completed: true },
                            }));
        
                            delete incomingFiles[data.id];
                            delete tempReceivingFiles[data.id];
                        }
        
                        if (fileData.receivedBytes === fileData.size) {
                            const fileBlob = new Blob(fileData.chunks, { type: fileData.fileType });
                            setIsReceivingFile(false);
                            const downloadUrl = URL.createObjectURL(fileBlob);
                            const a = document.createElement('a');
                            a.href = downloadUrl;
                            a.download = fileData.name || 'download';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(downloadUrl);
                            setReceivingFiles(prev => ({
                                ...prev,
                                [data.id]: { ...prev[data.id], blob: fileBlob, completed: true },
                            }));
                            axios.patch(`${api}/logs/${fileData.logId}`, {
                                received: true,
                            });
                            delete incomingFiles[data.id];
                        }
                    }
                }
            });
        
            conn.on('close', () => {
                Object.values(incomingFiles).forEach(fileData => {
                    if (fileData.sender === conn.peer) {
                        axios.patch(`${api}/logs/${fileData.logId}`, {
                            received: false,
                        });
                        delete incomingFiles[fileData.id];
                        setReceivingFiles(prev => ({
                            ...prev,
                            [fileData.id]: { ...prev[fileData.id], completed: false },
                        }));
                    }
                });
            });
            conn.on('error', (err) => {
                console.error(`Error with connection from ${conn.peer}:`, err);
            });
        });
        
        setMe(peer);
        setPeerInitialized(true);
        
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myInfo]);

    const roomDestroyedRtc = ({ roomId }) => {
        window.location.href = '/';
    };

    const destroyRoomRtc = ({ roomId }) => {
        window.location.href = '/';
    };

    const checkRemovedPeer = (peerId) => {
        removePeer(peerId);
        Object.values(incomingFiles).forEach(fileData => {
            if (fileData.sender === peerId) {
                axios.patch(`${api}/logs/${fileData.logId}`, {
                    received: false,
                });
                delete incomingFiles[fileData.id];
                setReceivingFiles(prev => ({
                    ...prev,
                    [fileData.id]: { ...prev[fileData.id], completed: false },
                }));
            }
        });
    };

    useEffect(() => {
        if (!ws.current) return;
        ws.current.on('close', () => {
            if (myInfo?.id && roomId) {
                ws.current.emit('leave-room', { roomId, peerId: myInfo.id });
            }
        });
    }, [myInfo, roomId, ws]);
    
    useEffect(() => {
        if(!ws) return
        ws.on("user-disconnected", checkRemovedPeer);
        ws.on("get-usersRTC", getUsers);
        ws.on('room-closedRtc', roomDestroyedRtc);
        ws.on('delete-closedRtc', destroyRoomRtc);

        return () => {
            ws.off("room-created");
            ws.off("user-disconnected");
            ws.off("room-closedRtc");
            ws.off("delete-closedRtc");
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ws, me, peers]);

    useEffect(() => {
        if (!me) {
            return;
        }
    
        const handleUserJoined = ({ peerId }) => {
            if (!peerId) {
                return;
            }
    
            const uName = `${myInfo.fname} ${myInfo.lname}`;
            const dataConnection = me?.connect(peerId, { metadata: { username: uName } });
            if (dataConnection) {
                dispatch(addPeerAction(peerId, dataConnection));
                
                // Send the current peer information to the new user
                Object.keys(peers).forEach((existingPeerId) => {
                    if (existingPeerId !== peerId) {
                        const existingDataConnection = me?.connect(existingPeerId, { metadata: { username: uName } });
                        dispatch(addPeerAction(existingPeerId, existingDataConnection));
                    }
                });
            }
        };
    
        ws.on("user-joined", handleUserJoined);
    
        return () => {
            ws.off("user-joined", handleUserJoined);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [me, ws, peers]);

    return (
        <RoomContext.Provider value={{
            ws, me, parti, peers, thisAdmin, roomId,
            setRoomId, resetPeer, cleanFile, fileTransferProgress,
            receivingFiles, isReceivingFile, setFileTransferProgress, setReceivingFiles, roomLock, setRoomLock,
            thisRoomActions, sendState, setSendState
        }}>{children}</RoomContext.Provider>
    );
};
