import React, { useContext, useEffect, useState } from 'react'
import PeerLogs from './PeerLogs'
import { AuthContext } from 'context/AuthContext'
import axios from 'axios'
import { sizeConvert } from 'functions/sizeConverter'
import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { Box } from '@mui/system'
import VaultLogs from './VaultLogs'

function Logs() {
const [peerData, setPeerData] = useState([])
const [vaultData, setVaultData] = useState([])
const [displayMode, setDisplayMode] = useState("peer")

  const { api, myInfo, setPageTitle } = useContext(AuthContext)
  useEffect(() => {
    if(myInfo?.id){
        axios.get(`${api}/logs/${myInfo?.company}`)
        .then((res) => {
            const logArray = []
            res.data.map((log, i) => (
                
                logArray.push({ 
                    id: i, email: 
                    log.senderEmail, 
                    filename: log.fileName, 
                    date: log.date, 
                    type: log.type, 
                    size: sizeConvert(log.size), 
                    received: log.received, 
                    receiver: log.receiver, 
                    receivers: log.receivers })
            ))
            setPeerData([...logArray])
        })
        axios.get(`${api}/vault-logs/${myInfo?.company}`)
        .then((res) => {
            const logArray = []
            res.data.map((log, i) => (
                
                logArray.push({ 
                    id: i, email: 
                    log.senderEmail, 
                    filename: log.fileName, 
                    date: log.date, 
                    type: log.type, 
                    size: sizeConvert(log.size), 
                    receivers: log.receivers })
            ))
            setVaultData([...logArray])
        })
    }


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myInfo])
  useEffect(()=>{
    setPageTitle(()=>"Transfer History")
    return()=> setPageTitle("...")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleDisplayMode = (event, nextValue) => {
    setDisplayMode(nextValue);
};
  return (
    <Box display={'flex'} flexDirection={'column'} gap={2}>
    <ToggleButtonGroup
        value={displayMode}
        onChange={handleDisplayMode}
        exclusive
      >
        <ToggleButton value={"peer"} aria-label="list-mode">
          <Typography fontWeight={'bold'}>Live Bridge</Typography>
        </ToggleButton>
        <ToggleButton value={"vault"} aria-label="card-mode">
          <Typography fontWeight={'bold'}>Integration</Typography>
        </ToggleButton>

      </ToggleButtonGroup>
        {
            displayMode === 'peer'?
            <PeerLogs data={peerData}/>
            :
            <VaultLogs data={vaultData}/>
        }
    </Box>
  )
}

export default Logs