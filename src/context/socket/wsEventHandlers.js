import axios from "axios";

export const enterRoom = (navigate) => ({ roomId, admin, type }) => {
    console.log(roomId)
    if (admin && roomId) {
        navigate(`/${type}/${roomId}`);
    }
};

export const getUsers = (setRoomLock, setThisAdmin, setThisRoomActions) => 
    ({ admin, locked, roomActions }) => {
        setRoomLock(locked);
        setThisAdmin(admin);
        setThisRoomActions(roomActions);
    };

export const roomDestroyed = () => () => {
    window.location.href = '/';
};

export const destroyRoom = (nodesSrv) => ({ roomId }) => {
    axios.delete(`${nodesSrv}/delete-all/${roomId}`).then(() => {});
    window.location.href = '/';
};
