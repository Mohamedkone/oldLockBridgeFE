import { useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { Routes, Route, Navigate } from "react-router-dom";

import themes from "themes";
import NavigationScroll from "./layout/NavigationScroll";

import MainLayout from "./layout/MainLayout";
import MinimalLayout from "./layout/MinimalLayout";
import ErrorRoute from "./routes/ErrorRoute";

import AuthLogin from "./views/pages/authentication/authentication/Login";
import CallbackPage from "./views/pages/authentication/CallbackPage";
import AccountSetting from "./views/pages/account/AccountSetting";
import Vault from "./views/pages/vault/finder/Vault";
import Logs from "./views/dashboard/transfers/Logs";
import { jwtDecode } from "jwt-decode";
import { useAuth0 } from "@auth0/auth0-react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import MaintenancePage from "MaintenancePage";
import Bridge from "views/pages/bridge";
import Dashboard from "./views/dashboard/Dash";
import Callbackss from "views/pages/authentication/Callbackss";
import CallbacksDrop from "views/pages/authentication/CallbacksDrop";
import Admin from "views/dashboard/Admin";

const UnauthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<MinimalLayout />}>
      <Route index element={<AuthLogin />} />
      <Route path="login" element={<AuthLogin />} />
      <Route path="callback" element={<CallbackPage />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  </Routes>
);


const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Dashboard />} />
      <Route path="admin" element={<Admin />} />
      <Route path="transfers" element={<Logs />} />
      <Route path="account" element={<AccountSetting />} />
      <Route path="vault" element={<Vault />} />
      <Route path="bridge">
      <Route index element={<Bridge />} />
      <Route path="generate" element={<Bridge />} />
      </Route>
      <Route path="callback" element={<CallbackPage />} />
      <Route path="callbackss" element={<Callbackss />} />
      <Route path="callbacksdrop" element={<CallbacksDrop />} />
      <Route path="*" element={<ErrorRoute />} />
    </Route>
  </Routes>
);



const App = () => {
  const isMaintenanceMode = process.env.REACT_APP_MAINTENANCE_MODE === 'true';
  const customization = useSelector((state) => state.customization);
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [, setCustomClaim] = useState(null);
  const { myInfo } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [role, setRole] = useState(null);
  useEffect(() => {
    if (myInfo) {
      setRole(myInfo.role);
      console.log(myInfo)
    }
  }, [myInfo]);

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          const decodedToken = jwtDecode(token);
          const myClaim = decodedToken['isGuess'];
          setCustomClaim(myClaim);
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    };

    fetchAccessToken();
  }, [getAccessTokenSilently, isAuthenticated]);

  if( isMaintenanceMode ) {
  
    return <MaintenancePage />

  }

  if (isLoading) {
    return <MinimalLayout />;
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>
          {isAuthenticated ? 
            <AuthenticatedRoutes />
            :
            <UnauthenticatedRoutes />
          }
        </NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
