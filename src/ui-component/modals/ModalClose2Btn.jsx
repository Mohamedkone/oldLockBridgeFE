import { Button, ButtonGroup, Modal, Typography, useTheme } from '@mui/material';
import { Box } from '@mui/system';

function ModalClose2Btn({ btn1Func, open, btn2Func, title, content, btn1, btn2, contentType = "" }) {
    const theme = useTheme()
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
            <ButtonGroup fullWidth sx={{ gap: "20px" }}>
                <Button 
                    color='error' 
                    variant='contained' 
                    onClick={btn1Func}
                    sx={{
                        color:"#fff",
                        background: theme.palette.error.dark 
                    }}
                    >
                    {btn1}
                </Button>
                <Button 
                    variant='contained' 
                    onClick={btn2Func}
                    color='success'
                    sx={{
                        color:"#fff",
                        background: theme.palette.success.dark 
                    }}
                >
                        {btn2}
                    </Button>
            </ButtonGroup>
            </Box>
        </Box>
        </Modal>
    );
}

export default ModalClose2Btn;
