export const handleFileChange = (event, setFile, setNbr, fSizeLimit, setLimitExceded) => {
    const files = Array.from(event.target.files);
    setNbr(files.length);

    if (files.length === 0) return;

    // Check if any file is of an unsupported type
    for (let i = 0; i < files.length; i++) {
        if (files[i].type === "") {
            console.error("Format not supported, only drag and drop files, no folder");
            return; // Exit if unsupported file format is found
        }
    }
    // Maximum individual file size in bytes (2000MB)
    const maxFileSize = fSizeLimit;

    // Filter files to include only those under the 2000MB limit
    const validFiles = files.filter(file => (file.size/1000000) <= maxFileSize);

    // Check if any file exceeded the size limit and log error
    if (validFiles.length < files.length) {
        console.error('Some files exceed the individual file size limit (2000MB) and have been excluded.');
        setLimitExceded(()=>true)
    }

    // Check if a single file exceeds the limit and return size error
    if (files.length === 1 && files[0].size/1000000 > maxFileSize) {
        console.error('File size exceeds the allowed limit (2000MB).');
        setLimitExceded(()=>true)
        return;
    }

    // Calculate total size of valid files
    const totalSize = validFiles.reduce((acc, file) => acc + file.size, 0);
    const maxSize = 10 * 1024 * 1024 * 1024; // 10GB limit

    if (totalSize > maxSize) {
        console.error('Total file size exceeds the allowed limit (10GB).');
    } else {
        setFile(validFiles.length > 1 ? validFiles : validFiles[0]);
    }

    // Reset the file input to allow reselecting the same files
    event.target.value = '';
    setNbr(validFiles.length)

};
