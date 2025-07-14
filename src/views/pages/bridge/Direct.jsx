import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Button,
  Tooltip,
} from "@mui/material";
import { CancelRounded, CheckCircle } from "@mui/icons-material";
import ModalClose2Btn from "ui-component/modals/ModalClose2Btn";
import ManageBridge from "./ManageBridge";
import axios from "axios";
import { AuthContext } from "context/AuthContext";

const Direct = () => {
  const [ modal, setModal ] = useState(false)
  const [ direct, setDirect ] = useState([])
  const [ info, setInfo ] = useState(null)
  const {api} = useContext(AuthContext)

  useEffect(()=>{
    const fetch = async() =>{
      await axios.get(`${api}/directbridges`).then((res)=>{
        setDirect(res.data)
      })
    }
    fetch()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const handleClose = () =>{
    setModal(false)
    setInfo(null)
  }

  const handleOpen = (e) =>{
    setModal(true)
    setInfo(e)
  }
  const handleSave = () =>{
    handleClose()
  }
  const remove = async(id) =>{
    await axios.delete(`${api}/directbridges/${id}`).then(()=>{
      window.location.reload()
    })

  }
  return (
    <>
    <TableContainer sx={{boxShadow:"0px 1px 5px #ccc", borderRadius:"10px"}}>
      <Table>
        <TableHead sx={{background:"#ddd"}}>
          <TableRow>
            <TableCell>Avatar</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Expire on</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {direct.map((user, index) => {
            const newDate = user.exp.split("T")
            return(
            <TableRow key={index}>
              <TableCell>
                <Avatar src={user.avatar} />
              </TableCell>
              <TableCell>{user.target}</TableCell>
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
              <TableCell>{user.link}</TableCell>
              <TableCell>
                <Button 
                    variant="contained" color="secondary"
                    sx={{color: "#fff"}}
                    onClick={()=>{handleOpen(user)}}
                >
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
    <ModalClose2Btn
      open={modal}
      title={"Manage bridge"}
      content={<ManageBridge live={false} info={info} remove={remove}/>}
      contentType='box'
      key={1}
      btn1={"Cancel"}
      btn2={"Save"}
      btn1Func={handleClose}
      btn2Func={handleSave}
      />
    </>
  );
};

export default Direct;
