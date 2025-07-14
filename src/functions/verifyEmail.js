const verifyEmail = (email) => {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/
    if(!emailRegex.test(email)) return false
    return true
} 

export default verifyEmail