import { Box, Button, Divider, Switch, Typography } from '@mui/material'
import React from 'react'

function Security() {

    const e = {
        1:{
            title: "Password",
            subtitle: "Set a unique password to protect your personal account.",
            button: <Button variant='text'>
                            Set password
                    </Button>,
        },
        2:{
            title: "Recovery codes",
            subtitle: "Get security codes to use when you can’t access your phone or email.",
            button: <Button variant='text'>
                            Show
                    </Button>
        },
        3:{
            title: "Two-step verification",
            subtitle: "Require a security key or code in addition to your password.",
            button: <Switch  />,
        },
        4:{
            title: "Devices",
            subtitle: "You haven’t linked any devices to your personal account.",
        },
    }

    const block = (element) =>(
            <Box
            display={"flex"}
            justifyContent={"space-between"}
            >
                <Box gap={2}>
                    <Typography variant='h4'>
                        {element.title}
                    </Typography>
                    <Typography variant='subtitle1'>
                        {element.subtitle}
                    </Typography>
                </Box>
                {
                    element?.button? element.button : null
                }
            </Box>
    )
    
    return (
        <Box 
            display={'flex'} 
            flexDirection={'column'} 
            gap={3}
            p={4}
        >
            <Typography variant="h3" gutterBottom>
                Security settings
            </Typography>
            <Box>
                {block(e[1])}
                <Divider sx={{ my: 2 }} />
                {block(e[2])}
                <Divider sx={{ my: 2 }} />
                {block(e[3])}
                <Divider sx={{ my: 2 }} />
                {block(e[4])}
                <Divider sx={{ my: 2 }} />
            </Box>
        </Box>
)
}

export default Security
