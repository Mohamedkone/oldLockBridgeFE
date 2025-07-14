import { Box, Button, ButtonGroup, Switch, TextareaAutosize, TextField, Typography, useTheme } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import CodeSnippet from './CodeSnippet'
import { AuthContext } from 'context/AuthContext'
import axios from 'axios'

function Integration({close}) {
    const [scriptCont, setScriptCont] = useState("#file-uploader-container")
    const [ header, setHeader ] = useState("{}")
    const [ onSucess, setOnSucess ] = useState("console.log('Files uploaded successfully:', data);")
    const [ onError, setOnError ] = useState("console.error('Error uploading files:', error);")
    const [ uUrl, setUUrl ] = useState("http://lockbridge/api/dist/index.js")
    const [ passphrase, setPassphrase ] = useState(true)
    const [ sse, setSSE ] = useState(false)
    const [ cse, setCSE ] = useState("true")
    const [ origin, setOrigin ] = useState("your-website.com")
    const [ darkMode, setDarkMode ] = useState(true)
    const { api, myInfo } = useContext(AuthContext)
    const [ myScript, setMyScript ] = useState({})
    const theme = useTheme()
    useEffect(()=>{
        const res = async()=>
            await axios.get(`${api}/integrations`).then((res)=>
                console.log(`${res.data[0].script.myScript}`)
            )
        res()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const genIntergration = () =>{
        const myDate = new Date()
        const year = myDate.getUTCFullYear()
        const month = String(myDate.getUTCMonth() + 1).padStart(2, '0')
        const day = String(myDate.getUTCDate()).padStart(2, '0')
        const date = `${year}-${month}-${day}`
        axios.post(`${api}/integrations`,{
            host: origin,
            script:{myScript},
            addedDate: date,
            ownerId: myInfo.id,
        })
    }

    const mySwitch = (val,setter) =>{
        return(
        <Box
                display={"flex"}
                alignItems={'center'}
            >
                <Typography>On</Typography>
                <Switch checked={Boolean(val)} onChange={(e)=>setter(e.target.checked)} />
                <Typography>OFF</Typography>
            </Box>
    )}
    const myText = (val,setter) =>(
        <TextField variant='outlined' value={val} onChange={(e)=>setter(e.target.value)} />
    )
    const myParagraph = (val, setter) =>(
        <TextareaAutosize value={val} minRows={5} onChange={(e)=>setter(e.target.value)} />
    )
    const setting = (text, input) =>(
        <Box>
            <Typography fontWeight={'bold'}>
                {text}
            </Typography>
            {input}
        
        </Box>
    )
    return (
        <Box py={3} px={1} display={'flex'} flexDirection={'column'} gap={3}>
            <Box
                display={"grid"} gap={5} gridTemplateColumns={"1fr 1fr"}
            >
            {setting("Server side encryptions", mySwitch(sse,setSSE))}
            {setting("Client side encryptions", mySwitch(cse,setCSE))}
            {setting("PassPhrase encryptions key mode", mySwitch(passphrase,setPassphrase))}
            {setting("Dark mode", mySwitch(darkMode,setDarkMode))}
            {setting("Taget html element container", myText(scriptCont,setScriptCont))}
            {setting("Upload to (https://www.exemple.com)", myText(uUrl,setUUrl))}
            {setting("Script host to (https://www.exemple.com)", myText(origin,setOrigin))}
            {setting("Header content", 
                myParagraph(header,setHeader)
            )}
            {setting("On success script", 
                myParagraph(onSucess, setOnSucess)
            )}
            {setting("On error script", 
                myParagraph(onError,setOnError)
            )}
            </Box>
            <CodeSnippet
            setMyScript={setMyScript}
            scriptCont={scriptCont}
            onSucess={onSucess}
            onError={onError}
            uUrl={uUrl}
            passphrase={passphrase}
            sse={sse}
            cse={cse}
            darkMode={darkMode}
            origin={origin}
            header={header}
            />
            <ButtonGroup fullWidth sx={{ gap: "20px" }}>
                <Button 
                    color='error' 
                    variant='contained' 
                    onClick={close}
                    sx={{
                        color:"#fff",
                        background: theme.palette.error.dark 
                    }}
                    >
                    Cancel
                </Button>
                <Button 
                    variant='contained' 
                    onClick={genIntergration}
                    color='success'
                    sx={{
                        color:"#fff",
                        background: theme.palette.success.dark 
                    }}
                >
                        Generate
                    </Button>
            </ButtonGroup>
        </Box>
    )
}

export default Integration
