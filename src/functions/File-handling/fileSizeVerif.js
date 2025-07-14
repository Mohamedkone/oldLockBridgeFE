export const fileSizeVerif = (file, compLimit) =>{
    const convertedSize = file/1000000
    return (convertedSize < compLimit)
}