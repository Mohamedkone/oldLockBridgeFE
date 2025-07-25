import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';

import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';
import ModalClose2Btn from 'ui-component/modals/ModalClose2Btn';
import { useState } from 'react';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F2F4F6",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor:"#fff",
    outline:"10px"
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // hide last border

  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function GuestGrid({rows, columns,setMOpen, api, compId}) {
  const {myInfo} = useContext(AuthContext)
  const [open, setOpen] = useState(false)
  const [removalId, setRemovalId] = useState(null)
  const modalText = "You are removing this users access to any room they have been invited  to under your company account, this action is irreversible. Do you want to continue?"

  const removeAccess = async (id) =>{
    try{
      const del = await axios.delete(`${api}/guest-lists/${compId}/${id}`)
      if (del.status === 204){
        window.location.reload()
      }
    }
    catch{
      console.error("Something went wrong")
      setOpen(!open)
    }
  }
  const close = () =>{
    setOpen(!open)
    setRemovalId(null)
  }

  return (
    <>
    <TableContainer component={Paper} sx={{borderRadius:"10px"}}>
    <Table sx={{ minWidth: 700 }} aria-label="customized table">
      <TableHead>
        <TableRow>
          {
            myInfo?.role === "Owner" || myInfo?.role === "Admin" ?

              columns.map((column,i)=>
                (
                  <StyledTableCell key={i} >{column.headerName}</StyledTableCell>
                ))
            :
            columns.filter(x=> x.headerName !== "Actions").map((column,i)=>
              (
                <StyledTableCell key={i} >{column.headerName}</StyledTableCell>
              ))
          
          }
        </TableRow>
      </TableHead>
      <TableBody sx={{border:"1px solid #D6DAE2",}}>
        {rows.map((row,i) =>{ 
          return(
          <StyledTableRow key={i}>
            <StyledTableCell width={"60%"} >{row.email}</StyledTableCell>
            {myInfo?.role === "Owner" || myInfo?.role === "Admin" ?
            <StyledTableCell >
              <Button variant='contained' color='error' onClick={()=>{setOpen(!open); setRemovalId(row.email) }}>Remove Access</Button>
            </StyledTableCell>
            :null}
          </StyledTableRow>
        )})}
      </TableBody>
    </Table>
  </TableContainer>
  <ModalClose2Btn btn1={"Cancel"} btn2={"Remove"} btn1Func={()=>removeAccess(removalId)} btn2Func={close} content={modalText} open={open} title={"Remove User ?"} contentType='text'/>
  </>
  )
}

export default GuestGrid