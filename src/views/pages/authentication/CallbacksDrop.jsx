import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { AuthContext } from "context/AuthContext";

const CallbacksDrop = () => {
  const navigate = useNavigate();
  const {myInfo} = useContext(AuthContext)

  useEffect(() => {
    if(myInfo?.id){
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const errorDescription = params.get("error_description");
    console.log(code)
    console.log(error)

    if (error) {
      console.error("Error during OAuth:", error, errorDescription);
      // Stay on the callback page and display error for debugging if necessary
      return;
    }

    if (code) {
      console.log("Authorization code received:", code);
      exchangeCodeForTokens(code, myInfo?.id);
    } else {
      console.warn("No code or error found in the callback URL.");
    }
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myInfo]);

  const exchangeCodeForTokens = async (code,userId) => {
    try {
      const redirectUri = "http://localhost:3000/callbacksdrop";
  
      // console.log(userId,code)
      // Send the authorization code to the backend
      await axios.post("http://localhost:3001/dp-api-storages", {
        userId: userId,
        code: code,
        redirectUri:redirectUri,
      });
  
      // Optionally redirect to another page after successful backend processing
      navigate("/account?tab=2");
    } catch (error) {
      console.error("Error sending code to backend:", error);
      navigate("/account?tab=2");
    }
  };
  // const exchangeCodeForTokens = async (code) => {
  //   try {
  //     const clientId = "304417414909-h29cj5ubvjppk6j2ftdj67otsp66rhqk.apps.googleusercontent.com";
  //     const clientSecret = "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";
  //     const redirectUri = "http://localhost:3000/callbackss";

  //     const response = await fetch("https://oauth2.googleapis.com/token", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded",
  //       },
  //       body: new URLSearchParams({
  //         code,
  //         client_id: clientId,
  //         client_secret: clientSecret,
  //         redirect_uri: redirectUri,
  //         grant_type: "authorization_code",
  //       }),
  //     });

  //     const tokens = await response.json();

  //     if (tokens.error) {
  //       console.error("Error exchanging code for tokens:", tokens.error_description);
  //       return;
  //     }

  //     console.log("Tokens received:", tokens);
  //     axios.post(`http://localhost:3001/api-storage`,{
  //       ownerId: myInfo?.id,
  //       system: 'Drive',
  //       refreshToken: tokens.refresh_token
  //     })
  //     // Optionally store the tokens or send them to your backend for secure storage

  //     // Navigate to a different page after successful exchange
  //     // navigate("/account?tab=2");
  //   } catch (error) {
  //     console.error("Error exchanging code for tokens:", error);
  //     // navigate("/account?tab=2");
  //   }
  // };

  return (
    <div className="page-layout">
      <Typography variant="h1">Processing login...</Typography>
    </div>
  );
};

export default CallbacksDrop;
