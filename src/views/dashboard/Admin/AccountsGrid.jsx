import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Avatar, Typography } from '@mui/material';
import DialogModal from 'ui-component/modals/DialogModal';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Box } from '@mui/system';
import { useContext } from 'react';
import { AuthContext } from 'context/AuthContext';

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

function AccountsGrid({rows, columns,setMOpen}) {
  const {myInfo} = useContext(AuthContext)
  return (
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
      <TableBody sx={{border:"1px solid #D6DAE2"}}>
        {rows.map((row,i) =>{ 
          return(
          <StyledTableRow key={i}>
            <StyledTableCell component="th" scope="row">
              <Avatar  src={row.avatar}/>
            </StyledTableCell>
            <StyledTableCell  component="th" scope="row" width={"200px"}>
              {row.name}
            </StyledTableCell>
            <StyledTableCell width={"300px"} >{row.email}</StyledTableCell>
            <StyledTableCell >
              <Box display={"flex"} border={row.role==="Admin"?"1px solid #000": "none"} justifyContent={'center'} backgroundColor={row.role==="Owner"?"#172338":row.role==="Admin"?"#fff":"#656F75"} color={row.role==="Owner"?"#fff":row.role==="Admin"?"#000":"#fff"} width={"10ch"} py={"3px"} px={4} borderRadius={"20px"}>
                <Typography fontSize={"14px"} lineHeight={"19.5px"}>
                  {row.role}
                </Typography>
              </Box>
            </StyledTableCell>
            <StyledTableCell >
              {
                row.status?<CheckCircleIcon color="success"  />:<CancelIcon color="error" />
              }
            </StyledTableCell>
            <StyledTableCell >
              {
                row.action.sub||row.action.subOAuth?<CheckCircleIcon color="success" />:<CancelIcon color="error" />
              }
            </StyledTableCell>
            {myInfo?.role === "Owner" || myInfo?.role === "Admin" ?
            <StyledTableCell >
               <DialogModal info = {row.action} setMOpen={setMOpen} /> 
            </StyledTableCell>
            :null}
          </StyledTableRow>
        )})}
      </TableBody>
    </Table>
  </TableContainer>
  )
}

export default AccountsGrid