import { createContext, useEffect, useContext, useRef } from "react";
import { AuthContext } from "../AuthContext";
import { io } from "socket.io-client";

export const WSContext = createContext(null);

export const WSProvider = ({ children }) => {
    const { nodesSrv } = useContext(AuthContext);

    // Memoized WebSocket instance
    const ws = useRef(null);
    
    useEffect(() => {
        ws.current = io(process.env.REACT_APP_API);
        console.log("WebSocket Initialized");
        return () => {
            console.log("Cleaning up WebSocket");
            ws.current.disconnect();
        };
    }, [nodesSrv]);

    return (
        <WSContext.Provider value={{
            ws: ws.current,
        }}>
            {children}
        </WSContext.Provider>
    );
};
