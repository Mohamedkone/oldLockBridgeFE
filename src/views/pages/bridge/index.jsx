import React, { useContext, useEffect, useState } from 'react'
import { Box, Container, Typography } from "@mui/material";
import Header from "./Header";
import TabsPanel from "./TabsPanel";
import { AuthContext } from 'context/AuthContext';
import Integration from './generate/Integration';
import LiveBridge from './generate/LiveBridge';
// import DirectBridge from './generate/DirectBridge';
import ModalBridge from 'ui-component/modals/ModalBridge';

function Bridge() {
    const {setPageTitle} = useContext(AuthContext)
    const [modal, setModal] = useState(false)
    const [ generateBtn, setGenerateBtn ] =  useState(1)
    const [ bText, setBText ] = useState("")
    useEffect(()=>{
        setPageTitle(()=>"Bridges")
        return()=>setPageTitle("...")
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const handleClose = () =>{
        setModal(()=>false)
    }

    const handleSave = () =>{
        handleClose()
    }
    const handleOpen = () =>{
        setModal(()=>true)
    }
    useEffect(()=>{
        setBText(`Add ${generateBtn}`)
    },[generateBtn])

    return (
        <Container maxWidth="lg">
            <Box 
                display={'flex'} flexDirection={'column'}
                alignItems={'center'}
            >
                <Typography textAlign={'center'}>
                    Create and manage your bridges with other users
                </Typography>
                <Typography  variant='caption'>
                    *** Bridges allows you to connect with other users ***
                </Typography>
            </Box>
            <Header handleOpen={handleOpen} bText={bText}/>
            <TabsPanel setGenerateBtn={setGenerateBtn}/>
            {generateBtn === 'Integration'  && <ModalBridge
                open={modal}
                title={"New integration bridge"}
                content={<Integration  close={handleClose}/>}
                contentType='box'
                key={1}
                btn1={"Cancel"}
                btn2={"Generate"}
                btn1Func={handleClose}
                btn2Func={handleSave}
            />}
            {generateBtn === 'Live'  &&<ModalBridge
                open={modal}
                title={"Generate a live bridge"}
                content={<LiveBridge close={handleClose} />}
                contentType='box'
                key={1}
                btn1Func={handleClose}
            />}
            {/* {generateBtn === 'Direct'  &&<ModalBridge
                open={modal}
                title={"Generate a bridge"}
                content={<DirectBridge close={handleClose} />}
                contentType='box'
                key={1}
                btn1={"Cancel"}
                btn2={"Generate"}
                btn1Func={handleClose}
                btn2Func={handleSave}
            />} */}
        </Container>
    )
}

export default Bridge
