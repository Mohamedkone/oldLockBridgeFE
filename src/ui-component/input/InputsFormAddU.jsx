import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { roles } from 'store/constant';


export default function InputsFormAddU({ formAccess, formFName, formLName, formEmail, formRole, setFormAccess, setFormFName, setFormLName, setFormEmail, setFormRole, email, myRole, role, isMyAccount }) {

  
  const handleTextChange = (e, setter) =>{
    setter(e.target.value)
  }
  const handleSelectChange = (e, setter) =>{
    setter(e.target.value)
  }
  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <div>
        <TextField
          label="First Name"
          id="fname"
          defaultValue={formFName}
          variant="filled"
          onChange={(e)=>handleTextChange(e, setFormFName)}
        />
        <TextField
          label="Last Name"
          id="lname"
          defaultValue={formLName}
          variant="filled"
          onChange={(e)=>handleTextChange(e, setFormLName)}
        />
      </div>
      <div>
        <TextField
          label="email"
          id="email"
          defaultValue={email}
          variant="filled"
          onChange={(e)=>handleTextChange(e, setFormEmail)}
        />

        <TextField
          id="filled-select-role"
          select
          label="Role"
          value={formRole}
          disabled={role !=="User" && myRole !== "Owner"? true: false}
          helperText="You can change users role"
          variant="filled"
          onChange={(e)=>handleSelectChange(e, setFormRole)}
        >
          {roles.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
            ))}
        </TextField>
      </div>
      <div>
       {isMyAccount?null:<TextField
          id="filled-select-access"
          select
          value={formAccess}
          label="Access"
          helperText="Temporarely remove access"
          variant="filled"
          onChange={(e)=>handleSelectChange(e,setFormAccess)}
        >
          {["Active", "Suspended"].map((option, index) => (
            <MenuItem key={option} value={index === 0}>
              {option}
            </MenuItem>
          ))}
        </TextField>}
      </div>
    </Box>
  );
}