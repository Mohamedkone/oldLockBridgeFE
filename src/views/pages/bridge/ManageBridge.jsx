import { Box, Button, FormControl, TextField, ToggleButton, ToggleButtonGroup } from "@mui/material"
import { useState } from "react"


const ManageBridge = ({live, info, remove}) =>{
    const [ bridgeStatus, setBridgeStatus ] = useState("active")
    const handleBStatus = (e, newValue) =>{
        setBridgeStatus(()=> newValue)
    }
    return(
        <Box 
            p={1} 
            maxWidth={"300px"}
            display={'flex'}
            flexDirection={'column'}
            gap={2}
        >
            <TextField 
            value={live?info.alias:info.target}
            disabled
            fullWidth={true}
            label={live?'Alias':"Email"}
            />
            <FormControl>
            <ToggleButtonGroup
                value={bridgeStatus}
                exclusive
                onChange={handleBStatus}
                aria-label="Bridge Status"
            >
                <ToggleButton color="primary" value="active">Active</ToggleButton>
                <ToggleButton color="error" value="suspend">Suspend</ToggleButton>
            </ToggleButtonGroup>
            </FormControl>
            <FormControl>
                <Button
                onClick={()=>remove(info.id)}
                color="error">Remove Permanently</Button>
            </FormControl>
        </Box>
    )
}

export default ManageBridge