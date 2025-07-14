import {useContext, useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import InputsForm from 'ui-component/input/InputsForm';
import axios from 'axios'
import { AuthContext } from 'context/AuthContext';

export default function DialogModal({info, setMOpen, isMyAccount=false}) {
  const {api, myInfo} = useContext(AuthContext)
  const { id, fname, lname, email, role, active } = info
  const [formFName, setFormFName] = useState(fname)
  const [formLName, setFormLName] = useState(lname)
  const [formRole, setFormRole] = useState(role)
  const [formAccess, setFormAccess] = useState(active)
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  
  
  useEffect(()=>{
    if (!open) {
    setFormAccess(active)
    setFormFName(fname)
    setFormLName(lname)
    setFormRole(role)
    }
  },[open, fname, lname, role, active])
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Create an object to hold the changes
    const changes = {};

    if (formFName !== fname) changes.fname = formFName;
    if (formLName !== lname) changes.lname = formLName;
    if (formRole !== role) changes.role = formRole;
    if (formAccess !== active) changes.active = formAccess;

    // Now, if changes object is not empty, send a patch request
    if (Object.keys(changes).length > 0) {
      // Replace 'userEndpoint' with your actual endpoint
      axios.patch(`${api}/users/${id}`, changes)
        .then(response => {
          // Handle response
          window.location.reload()
        })
        .catch(error => {
          // Handle error
          setMOpen(()=>true)
        });
    }

    setOpen(false);
  };

  return (
    <>
     <Button variant='contained' color='secondary' sx={{ fontWeight:"400", borderRadius:"10px", minWidth:"45px", height:"34px"}}  onClick={handleClickOpen}>Edit</Button>
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
            <InputsForm formFName={formFName} setFormFName={setFormFName} formLName={formLName} setFormLName={setFormLName} formAccess={formAccess} setFormAccess={setFormAccess}
              formRole={formRole} setFormRole={setFormRole} email={email} myRole={myInfo.role} role={role} isMyAccount={isMyAccount}
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