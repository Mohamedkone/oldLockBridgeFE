import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading({width=null}) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CircularProgress style={width? {width:"1000px"}: null}/>
    </Box>
  );
}