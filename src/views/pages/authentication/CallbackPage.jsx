import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from '@mui/material/Typography';
import { useAuth0 } from "@auth0/auth0-react";

const CallbackPage = () => {
  const navigate = useNavigate();
  const {  getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const error = params.get('error');
    const errorDescription = params.get('error_description');
    
    if (error) {
      // Navigate to the root with error details
      navigate('/', {state: {error: 401, error_title: error, error_description: errorDescription}});
    } else if (code) {
      // Attempt to get tokens using the code if no error is present
      getAccessTokenSilently({ code })
        .then(() => {
          navigate('/dashboard'); // Redirect to a dashboard or a protected route
        })
        .catch((err) => {
          console.error('Error obtaining tokens', err);
          navigate('/test', {state: {error: 401, error_title: 'Token Error', error_description: 'Failed to obtain tokens'}});
        });
    } else {
      // If no code or error, just redirect to the home page
      navigate('/');
    }
  }, [navigate, getAccessTokenSilently]);

  return (
    <div className="page-layout">
      <Typography variant="h1">Processing login...</Typography>
    </div>
  );
};

export default CallbackPage;
