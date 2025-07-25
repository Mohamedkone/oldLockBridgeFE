import { Box, Icon, Typography } from '@mui/material'
import React from 'react'

function SiteCard({cName, cIcon, cColor, status}) {
    return (
        <Box
        sx={{
            py: "20px",
            width: "min(30dvw, 200px)",
            height: "100px",
            display: "flex",
            justifyContent: "center",
            borderRadius: "12px",
            textAlign: "center",
            alignItems: "center",
            flexDirection: "column",
            border: "1px solid #ccc"
        }}
        >
            <Icon as={cIcon} color={cColor}/>
            <Typography fontWeight={"bold"}>Status: {status?"Up":"Down"}</Typography>
            <Typography>{cName}</Typography>
        </Box>
    )
}


export default SiteCard