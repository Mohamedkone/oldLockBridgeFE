import { Box, Link, Typography, useTheme } from '@mui/material'
import React from 'react'

function BigCard({width, minHeight, maxHeight, title, children, link}) {
    const theme = useTheme()
    return (
        <Box 
            sx={{
                width: width,
                minHeight: minHeight,
                maxHeight: maxHeight,
                boxShadow: "0 0px 5px #ccc",
                borderRadius: "8px",
                py:"24px",
                px:"12px",
                position: "relative"
            }}
            >
                <Box 
                    py={1} 
                    px="10px"
                    display={'flex'}
                    justifyContent={'space-between'}
                >
                    <Typography variant='h3'>
                    {title}
                    </Typography>
                    <Link href={link} color={theme.palette.primary.main}>
                        See More
                    </Link>
                </Box>
                {children}
            </Box>
    )
}

export default BigCard
