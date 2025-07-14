import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../AuthContext";
import { destroyRoom, getUsers, roomDestroyed } from "./wsEventHandlers";
import { WSContext } from "./wsContext";
export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const navigate = useNavigate();
    const { ws } = useContext(WSContext)
    const { myInfo, nodesSrv } = useContext(AuthContext);
    const [roomId, setRoomId] = useState("");
    const [thisAdmin, setThisAdmin] = useState("");
    const [thisRoomActions, setThisRoomActions] = useState();
    const [roomLock, setRoomLock] = useState(null);
    
    useEffect(() => {
        
        
        ws.on("get-users", (data)=>getUsers(setRoomLock, setThisAdmin, setThisRoomActions)(data));
        ws.on('room-closed', (data) => roomDestroyed()(data));
        ws.on('delete-closed', (data) => destroyRoom(nodesSrv)(data));

        // Handle cleanup
        return () => {
            ws.off("room-created");
            ws.off("get-users");
            ws.off('room-closed');
            ws.off('delete-closed');
        };
    }, [navigate, nodesSrv, ws]);

    useEffect(() => {
        if (!ws.current) return;
        ws.current.on('close', () => {
            if (myInfo?.id && roomId) {
                ws.current.emit('leave-room', { roomId, peerId: myInfo.id });
            }
        });
    }, [myInfo, roomId, ws]);

    return (
        <SocketContext.Provider value={{
            ws,
            thisAdmin,
            roomId,
            setRoomId,
            roomLock,
            setRoomLock,
            thisRoomActions
        }}>
            {children}
        </SocketContext.Provider>
    );
};
