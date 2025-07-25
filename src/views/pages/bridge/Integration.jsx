import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Tooltip,
  Box,
  Typography,
} from "@mui/material";
import { CancelRounded, Check, CheckCircle } from "@mui/icons-material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ModalClose1Btn from "ui-component/modals/ModalClose1Btn";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import axios from "axios";
import { AuthContext } from "context/AuthContext";
import { IconScript } from "@tabler/icons-react";
import ModalClose2Btn from "ui-component/modals/ModalClose2Btn";


const ManageBridge = ({codeString}) =>{
  const [copied, setCopied] = useState(false)
      const copyToClipboard = () => {
          navigator.clipboard.writeText(codeString);
          setCopied(()=>true)
          setTimeout(()=>{
              setCopied(()=>false)
          },3000)
      };
  return(
  <Box
        sx={{
            bgcolor: "#172338",
            color: "#c5c5c5",
            p: 2,
            borderRadius: 2,
            fontFamily: "monospace",
            position: "relative",
            width: "100%",
            maxHeight:"500px",
            overflowX: "auto",
        }}
        >
        <Tooltip
            title="Copy to Clipboard" 
            placement="top"
        >
            {copied
            ?
                <Box 
                    display={'flex'} 
                    alignItems={'center'}
                    sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        color: "#fff",
                    }}
                >
                    <Check />
                    <Typography>
                        Copied
                    </Typography>
                </Box>
                :
                <Button
                onClick={copyToClipboard}
                sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    color: "#fff",
                }}
                startIcon={<ContentCopyIcon />}
                >
                Copy
                </Button>
            }
        </Tooltip>
        <Box component="pre" sx={{ whiteSpace: "pre-wrap" }}>
            <SyntaxHighlighter language="javascript" style={dracula}>
                {codeString}
            </SyntaxHighlighter>
        </Box>
        </Box>
)}

const Integration = () => {
  const [ modal, setModal ] = useState(false)
  const [ deleteModal, setDeleteModal ] = useState(false)
  const [ bridges, setBridges ] = useState(null)
  const [ chosenOne, setChosenOne ] = useState(null)
  const [ chosenDel, setChosenDel ] = useState(null)
  const [ popTitle, setPopTitle ] = useState("")
  const {api} = useContext(AuthContext)

  useEffect(()=>{
    const fetch = async()=>{
      await axios.get(`${api}/integrations`).then((res)=>{
        setBridges(res.data)
      })
    }
    fetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleClose = () =>{
    setModal(false)
    setChosenOne(null)
  }
  const handleDelClose = () =>{
    setChosenDel(null)
    setDeleteModal(false)

  }
  const handleDelSave = async() =>{
    await axios.delete(`${api}/integrations/${chosenDel}`)
    .then((res)=>{
      handleDelClose()
      window.location.reload()
    })
  }

  const openPop = (e) =>{
    setChosenOne(e?.script?.myScript)
    setPopTitle(e.host)
    setModal(true)
  }

  const openDelPop = (e) =>{
    setChosenDel(e)
    setDeleteModal(true)
  }

  return (
    <>
    {bridges ?
    <TableContainer sx={{boxShadow:"0px 1px 5px #ccc", borderRadius:"10px"}}>
      <Table>
        <TableHead sx={{background:"#ddd"}}>
          <TableRow>
            <TableCell>Host</TableCell>
            <TableCell>Added Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
            <TableCell>View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bridges.map((user, index) => {
            const newDate = user.addedDate.split("T")
            return(
            <TableRow key={index}>
              <TableCell>{user.host}</TableCell>
              <TableCell>{newDate[0]}</TableCell>
              <TableCell>
                {
                user.status ? 
                    <Tooltip title="Active">
                        <CheckCircle color="primary" /> 
                    </Tooltip>
                : 
                    <Tooltip title="Down">
                        <CancelRounded color="error"/>
                    </Tooltip>
                }
              </TableCell>
              <TableCell>
                <Button 
                    variant="contained" color="secondary"
                    sx={{color: "#fff"}}
                    startIcon={<IconScript />}
                    onClick={()=>openPop(user)}
                >
                  View Script
                </Button>
              </TableCell>
              <TableCell>
                <Button 
                    variant="contained" color="error"
                    sx={{color: "#fff"}}
                    onClick={()=>openDelPop(user.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
    :<Typography>You currently do not have any integration setup</Typography>}
    <ModalClose1Btn
      open={modal}
      title={popTitle}
      content={<ManageBridge codeString={chosenOne}/>}
      contentType='box'
      key={1}
      btn={"Close"}
      handleAction={handleClose}
    />
    <ModalClose2Btn
      open={deleteModal}
      title={popTitle}
      content={<Typography>Are you sure you want to delete this integration?</Typography>}
      contentType='text'
      key={2}
      btn1={"Close"}
      btn2={"Delete"}
      btn1Func={handleDelClose}
      btn2Func={handleDelSave}
    />
    </>
  );
};

export default Integration;