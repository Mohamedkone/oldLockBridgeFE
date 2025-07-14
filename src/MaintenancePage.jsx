// MaintenancePage.jsx
import { Divider, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React from 'react';
import Logo from 'ui-component/Logo';

const MaintenancePage = () => {
  return (
    <Box display={'flex'} justifyContent={'center'} alignItems={'center'} width={'100dvw'} height={'100dvh'} flexDirection={'column'} gap={2}>
        <Logo />
      <Typography variant='h2' fontWeight={'bold'}>We'll Be Right Back!</Typography>
      <Divider 
        style={{
            py: 0,
            width: '100px',
            maxWidth: 360,
            borderRadius: 2,
            border: '1px solid',
            borderColor: '#000',
            backgroundColor: 'background.paper',

        }}
      />
      <Typography variant='body1'>
        Our website is currently undergoing scheduled maintenance to bring you an even better experience.
      </Typography>
      <Typography variant='body2'>
        We apologize for the inconvenience and appreciate your patience. Please check back soon.
      </Typography>
      <Typography variant='caption'>
      — The LockBridge Team
      </Typography>
    </Box>
  );
};

export default MaintenancePage;
