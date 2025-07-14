import React, { useContext, useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import { Box, Tab, Tabs } from '@mui/material';
import { AuthContext } from 'context/AuthContext';
import Profile from './Profile';
import Notifications from './Notifications';
import Storage from './Storage';
import Billing from './Billing';
import Security from './Security';
import { useSearchParams } from "react-router-dom";


function AccountSetting() {
  const { setPageTitle } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedTab, setSelectedTab] = useState(Number(searchParams.get('tab'))|| 0);

  const accountTab = 
  ["Account", "Notifications", "Storage", "Security", "Billing"]
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    updateQueryParams(newValue)
  };
  
  // useEffect(() => {
  //   if(searchParams.get('tab'))
  //   setSelectedTab(searchParams.get('tab'));
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams]);

  // Fetch settings data
  useEffect(() => {
    setPageTitle(() => 'Account');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQueryParams = (tab) => {
    searchParams.set('tab', tab);
    setSearchParams(searchParams);
  };


  return (
    <Container 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 2 
      }}>
      <Box sx={{ width: "100%" }}>
      {/* Tabs Navigation */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{
          "& .MuiTabs-indicator": {
            display: "none",
          },
        }}
      >
        {accountTab.map(
          (label, index) => (
            <Tab
              key={index}
              label={label}
              sx={{
                textTransform: "none",
                borderRadius: "30px", 
                paddingX: 3,
                paddingY: 1,
                marginX: 0.5,
                backgroundColor: selectedTab === index ? "secondary.main" : "grey.300",
                color: selectedTab === index ? "#fff" : "black",
                "&.Mui-selected": {
                  color: "white",
                },
                "&:hover": {
                  backgroundColor: selectedTab === index ? "secondary.dark" : "grey.400",
                  color: "#fff",
                },
              }}
            />
          )
        )}
      </Tabs>

      <Box sx={{ px: 2, py: 5 }}>
        {selectedTab === 0 && (
          <Profile />
        )}

        {selectedTab === 1 && (
          // <Typography variant="body1">Notifications content here...</Typography>
          <Notifications />
        )}
        {selectedTab === 2 && (
          // <Typography variant="body1">Sharing content here...</Typography>
          <Storage setSelectedTab={setSelectedTab}/>
        )}
        {selectedTab === 3 && (
          // <Typography variant="body1">Update Schedule content here...</Typography>
          <Security />
        )}
        {selectedTab === 4 && (
          // <Typography variant="body1">Billing content here...</Typography>
          <Billing />
        )}
      </Box>
    </Box>
    </Container>
  );
}

export default AccountSetting;