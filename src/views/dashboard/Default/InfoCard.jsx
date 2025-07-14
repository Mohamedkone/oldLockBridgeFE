import { Icon, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React from 'react'

function InfoCard({mainIcon, textColor, bgColor, bigText, caption}) {
    return (
        <Box 
            sx={{
                background: bgColor,
                color: textColor,
                width: "200px",
                height: "140px",
                display: "flex",
                flexDirection:'column',
                justifyContent:'space-evenly',
                alignItems:'center',
                borderRadius: '8px',
                boxShadow: "0px 1px 8px #ccc"
            }}>
                <Box width={"50px"} height={"30px"} borderRadius={"50%"} 
                display={'flex'} justifyContent={'center'} alignItems={'center'}
                
                >
                    <Icon as={mainIcon}/>
                </Box>
                <Typography fontSize={"25px"} fontWeight={"bold"}>{bigText}</Typography>
                <Typography variant='caption'>{caption}</Typography>
            </Box>
    )
}

export default InfoCard
