import {useContext, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import axios from 'axios'
import { AuthContext } from 'context/AuthContext';
import InputsFormAddU from 'ui-component/input/InputsFormAddU';
import AddIcon from '@mui/icons-material/Add';


export default function DialogModalAddU({info, setMOpen, isMyAccount=false, company, setContent}) {
  const {api, myInfo} = useContext(AuthContext)
  const { fname, lname, email, role, active } = info
  const [formFName, setFormFName] = useState(fname)
  const [formLName, setFormLName] = useState(lname)
  const [formEmail, setFormEmail] = useState(email)
  const [formRole, setFormRole] = useState(role)
  const [formAccess, setFormAccess] = useState(active)
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  
  useEffect(()=>{
    if (!open) {
      setFormFName(fname)
      setFormLName(lname)
      setFormLName(email)
      setFormAccess(active)
      setFormRole(role)
    }
  },[open, fname, lname, role, active, email])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    let error = false
    // Create an object to hold the changes
    const changes = {};

    if (formFName !== fname) {
      changes.fname = formFName;
    }else{
      error = true
    }
    if (formLName !== lname) {
      changes.lname = formLName;
    }else{
      error = true
    }
    if (formEmail !== email) {
      changes.email = formEmail;
    }else{
      error = true
    }
    if (formRole !== role) changes.role = formRole 
    else changes.role = role
    if (formAccess !== active) changes.active = formAccess;
    else changes.active = active;


    // Now, if changes object is not empty, send a patch request
    if (Object.keys(changes).length > 0 && error === false) {
      changes.company = company
      // Replace 'userEndpoint' with your actual endpoint
      axios.post(`${api}/users`, changes)
        .then(response => {
          // Handle response
          window.location.reload()
        })
        .catch(error => {
          // Handle error
          if(error.response.status === 409){
            setContent("This email is already registered")
          }
          setMOpen(()=>true)
        
        });
    }

    setOpen(false);
  };

  return (
    <>
    <Button variant='contained' color='secondary' startIcon={<AddIcon />} onClick={handleClickOpen} sx={{alignSelf:"flex-end"}}>Add User</Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title" fontSize={20}>
          {"User informations "}
        </DialogTitle>
        <DialogContent>
            <InputsFormAddU formFName={formFName} setFormFName={setFormFName} formLName={formLName} setFormLName={setFormLName} formAccess={formAccess} setFormAccess={setFormAccess}
              formRole={formRole} setFormRole={setFormRole} formEmail={formEmail} setFormEmail={setFormEmail} myRole={myInfo?.role} role={role} isMyAccount={isMyAccount}
            />
        </DialogContent>
        <DialogActions>
          <Button  variant='contained' color='secondary' sx={{background:'#999'}} autoFocus onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} autoFocus variant='contained' color='info'>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}