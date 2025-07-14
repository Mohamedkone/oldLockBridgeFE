import {  Button, ButtonGroup, Modal, Typography } from '@mui/material'
import { Box } from '@mui/system'

function PriceModal({handleAction, open, title, content,btn, contentType=""}) {
  return (
    <Modal
            onClose={handleAction}
            open={open}
            aria-labelledby="Close the room"
            aria-describedby="Are you sure you want to close the room ?"
        >
            <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100dvh'}>
                <Box 
                minHeight={'300px'} sx={{background:"#fff", }} 
                display={'flex'} flexDirection={'column'} justifyContent={'space-between'} 
                p={2} borderRadius={"10px"} gap={2} 
                >
                    <Typography variant='h3'>{title}</Typography>
                    {contentType==="text"?
                    <Typography variant='body1' fontSize={18}>
                        {content}
                    </Typography>
                    : contentType==="list"? <Box maxHeight={'400px'} display={'flex'} gap={2} flexDirection={'column'} sx={{overflowY:"auto"}} px={2}>{content}</Box>
                    :
                    <Box alignSelf={contentType==="qr"?'center':'auto'}>{content}</Box>
                    }
                    <ButtonGroup fullWidth sx={{gap:"20px"}}>
                        <Button color='secondary' variant='contained' onClick={handleAction}>{btn}</Button>
                    </ButtonGroup>
                </Box>
            </Box>
        </Modal>
  )
}

export default PriceModal