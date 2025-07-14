import {  Button, ButtonGroup, Modal, Typography } from '@mui/material'
import Alert from '@mui/material/Alert';
import { Box } from '@mui/system'
import CloseIcon from '@mui/icons-material/Close';
import { useEffect } from 'react';
function ModalFileUpload({handleAction, open, title, content,btn, contentType="", limitExceded, setLimitExceded}) {

    useEffect(()=>{
        if(limitExceded){
            setTimeout(()=>{
                setLimitExceded(()=>false)
            },4000)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[limitExceded])

    return (
        <Modal
            onClose={handleAction}
            open={open}
            aria-labelledby="Close the room"
            aria-describedby="Are you sure you want to close the room ?"
        >
            <Box display={'flex'} flexDirection={'column'} gap={4} justifyContent={'center'} alignItems={'center'} height={'100dvh'}>
                <Box 
                width={"fit-content"} minHeight={'300px'} sx={{background:"#fff", }} position={'relative'}
                borderRadius={"10px"} maxHeight={"85dvh"} overflow={'auto'}
                >
                    <Box display={'flex'} flexDirection={'column'} justifyContent={'space-between'} 
                p={5} borderRadius={"10px"} gap={2} >
                    <Typography variant='h2'>{title}</Typography>
                    {contentType==="text"?
                    <Typography variant='body1' fontSize={18}>
                        {content}
                    </Typography>
                    : contentType==="list"? <Box maxHeight={'400px'} display={'flex'} gap={2} flexDirection={'column'} sx={{overflowY:"auto"}} px={2}>{content}</Box>
                    :
                    <Box alignSelf={contentType==="qr"?'center':'auto'}>{content}</Box>
                }
                    <ButtonGroup fullWidth sx={{gap:"20px"}}>
                    </ButtonGroup>
                </Box>
                <Box position={'absolute'} top={0} right={0} p={1}>
                    <Button variant={"contained"}  color={"error"} sx={{p:"3px", minWidth:"2ch", borderRadius:"50px"}}>
                        <CloseIcon  spacing={0} onClick={handleAction} sx={{cursor:"pointer"}}/>
                    </Button>
                </Box>
                </Box>
                <Box height={"50px"}>
                    {limitExceded?<Alert variant="filled" severity="error">
                        Some files exceed the individual file size limit and have been excluded
                    </Alert>:null}
                </Box>
            </Box>
        </Modal>
    )
}

export default ModalFileUpload