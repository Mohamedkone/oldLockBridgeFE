import { Modal, Typography,  } from '@mui/material';
import { Box } from '@mui/system';

function ModalBridge({ btn1Func, open, title, content, contentType = "" }) {
    return (
        <Modal
        onClose={btn1Func}
        open={open}
        aria-labelledby="Close the room"
        aria-describedby="Are you sure you want to close the room?"
        >
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'} height={'100dvh'}>
            <Box
            minWidth={"400px"} minHeight={'300px'} sx={{ background: "#fff" }}
            display={'flex'} flexDirection={'column'} justifyContent={'space-between'}
            p={5} borderRadius={"10px"} gap={2}
            >
            <Typography variant='h3'>{title}</Typography>
            {contentType === "text" ? (
                <Typography variant='body1' fontSize={18} maxWidth={"75ch"}>
                {content}
                </Typography>
            ) : (
                <Box maxHeight={"600px"} overflow={"auto"}>
                {content}
                </Box>
            )}
            </Box>
        </Box>
        </Modal>
    );
}

export default ModalBridge;
