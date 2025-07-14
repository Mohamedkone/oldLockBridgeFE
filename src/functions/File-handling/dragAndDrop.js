export const handleDragEnter = (event, setState) => {
    event.preventDefault();
    setState(()=>true);
};

export const handleDragOver = (event) => {
    event.preventDefault();

};

export const handleDragLeave = (event, setState) => {
    event.preventDefault();
    setState(()=>false);
};

export const handleDrop = (event, setState, next) => {
    event.preventDefault();
    setState(()=>false);
    let retarget={target:event.dataTransfer}
    next(retarget)
};

export const uploadbtnMouse = (e, inref) => {
    e.preventDefault();

    // Trigger the input element's click event
    if (inref.current) {
        inref.current.click();
    }
};