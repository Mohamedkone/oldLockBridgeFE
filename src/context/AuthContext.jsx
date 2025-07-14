import { createContext, useState } from "react"

import { useCookies } from "react-cookie"
import { useAuth0 } from "@auth0/auth0-react"
import axios from "axios"


export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

    // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies()
    const [myInfo, setMyInfo] = useState(null)
    const [pageTitle, setPageTitle] = useState("Page...")
    const [compSettings, setCompSettings] = useState({})
    const { logout } = useAuth0()
    const api = process.env.REACT_APP_API
    const dropLink = process.env.REACT_APP_DROP
    const nodesSrv = process.env.REACT_APP_NODES
    // const navigate = useNavigate()
    const handleLogout = () => {
        if(cookies['auth-r-key'])removeCookie('auth-r-key')
        logout({
            logoutParams: {
            returnTo: `${window.location.origin}/login`,
            },
        });
    };

    axios.defaults.headers.common['authorization'] = cookies["auth-r-key"]

   
	// axios.interceptors.response.use(
	//   (response) => {
	// 	return response
	//   },
	//   (error) => {
    //    return error
	//   }
	// );


    return (
        <AuthContext.Provider value={{ handleLogout, myInfo, setMyInfo, api, dropLink,nodesSrv, pageTitle, setPageTitle, compSettings, setCompSettings }}>{children}</AuthContext.Provider>
    )
}