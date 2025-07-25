import { Box, Button, ButtonGroup, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import AccountsGrid from './AccountsGrid';
import Avatar from '@mui/material/Avatar';
// import { useAuth0 } from '@auth0/auth0-react';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from 'context/AuthContext';
import ModalClose1Btn from 'ui-component/modals/ModalClose1Btn';
import DialogModal from 'ui-component/modals/DialogModal';
import DialogModalAddU from 'ui-component/modals/DialogModalAddU';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import InviteModalClose1Btn from 'ui-component/modals/InviteModalClose1Btn';
import verifyEmail from 'functions/verifyEmail';
import GuestGrid from './GuestGrid';


export default function Admin() {

  const { api, myInfo, setPageTitle } = useContext(AuthContext)
  const [team, setTeam] = useState([])
  const [myGuest, setMyGuest] = useState([])
  const [mOpen, setMOpen] = useState(false)
  const [gOpen, setGOpen] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestFname, setGuestFname] = useState('')
  const [guestLname, setGuestLname] = useState('')
  const [gInviteError, setGInviteError] = useState(null)
  const [gInviteNError, setGInviteNError] = useState(null)
  const [collegues, setCollegues] = useState(null)
  const [displayMode, setDisplayMode] = useState("users")
  // const [isWaiting, setIsWaiting] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [showEAlert, setShowEAlert] = useState(false)
  // const [alertText, setAlertText] = useState("")
  const [errorText, setErrorText] = useState("")
  // const [aOpen] = useState(false)
  const [content, setContent] = useState("We have encoutered an issue, please refresh the page to try again. If the issue persist, please contact us")
  useEffect(()=>{
    setPageTitle(()=>"Admin")
    return()=>setPageTitle("...")
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  // const info = {
  //   id: "",
  //   fname: "",
  //   lname: "",
  //   email: "",
  //   role: "User",
  //   active: false,
  // }

  useEffect(() => {
    if (showAlert) {
        const timer = setTimeout(() => {
            setShowAlert(() => false)
            // setAlertText(()=>"")
        }, 1000);
        return () => clearTimeout(timer)
    }
}, [showAlert])
useEffect(() => {
    if (showEAlert) {
        const timer = setTimeout(() => {
            setShowEAlert(() => false)
            setErrorText(()=>"")
        }, 1000);
        return () => clearTimeout(timer)
    }
}, [showEAlert])

  const data = !team ? null : team
  .filter(d => d.id !== myInfo.id)
  .map((d, i) => ({
    id: i + 1,
    avatar: d?.avatar,
    name: `${d?.fname} ${d?.lname}`,
    email: d?.email,
    // addedDate: d?.addedDate,
    role: d?.role,
    status: d?.active,
    action: d
  }));
  const guetData = !myGuest ? null : myGuest
  .map((d, i) => ({  
    email: d?.guestId,
    action: d
  }));

  const handleClose = () =>{
    setMOpen(()=>false)
  }
  const getCollegues = async () => {
    const res = await axios.get(`${api}/users/${myInfo?.company}`)
    const newArr = res.data.map((d, i) => (
      {key:d.email}
    ))
    setCollegues(() => [...newArr])
}

  useEffect(() => {
    let isMount = true
    const getUsers = async () => {
      try{
        const res = await axios.get(`${api}/users/${myInfo?.company}`)
        if(res.data)setTeam(() => [...res?.data])
      }
      catch{
        console.error("We have had problem retrieving your data")
        setMOpen(true)
        return null
      }
    }
    const getGuest = async() =>{
      try{
        const res = await axios.get(`${api}/guest-lists/${myInfo?.company}`)
        if(res.data)setMyGuest(()=>[...res.data])
      }
      catch{
        console.error("We have had problem retrieving your data")
        setMOpen(true)
        return null
      }
    }

    if (isMount === true && myInfo) {
      getUsers()
      getGuest()
    }
    return (() => {
      isMount = false
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myInfo])
  const columns = [
    {
      field: 'avatar', headerName: 'Avatar', width: 100, sortable: false, renderCell: (params) => {
        return (
          <Avatar src={params.value} />
        )
      }
    },
    { field: 'name', headerName: 'Name', width: 300, sortable: false },
    { field: 'email', headerName: 'Email', width: 400,  },
    // { field: 'addedDate', headerName: 'Joined Date', width: 130 },
    { field: 'role', headerName: 'Role', width: 80 },
    { field: 'status', headerName: 'Status', width: 80, renderCell:(params)=>{
      if(params.row.status)
      return(
    <Box display={'flex'} justifyContent={'center'} width={'100%'}>
        <CheckIcon />
      </Box>
      )
      else return( 
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
        <CloseIcon />
      </Box>
      )
    } },
    
    { field: 'joined', headerName: 'Joined', width: 80, renderCell:(params)=>{
      if(params.row.action.sub)
      return(
      <Box display={'flex'} justifyContent={'center'} width={'100%'}>
        <CheckIcon />
      </Box>
      )
      else return( 
        <Box display={'flex'} justifyContent={'center'} width={'100%'}>
        <CloseIcon />
      </Box>
      )
    } },
    {
      field: 'actions', headerName: 'Actions', width: 200, sortable: false, renderCell: (params) => {
        if(params.row.role !== "Owner")
        return (
      <Box display={'flex'} gap={2}>
            <DialogModal info = {params.row.action} setMOpen={setMOpen} />
          </Box>
        )
      }
    },

  ];
  
  const guestColumns = [
    
    { field: 'email', headerName: 'Email', width: 800,  },
    
    {
      field: 'actions', headerName: 'Actions', width: 200, sortable: false, renderCell: (params) => {
        if(params.row.role !== "Owner")
        return (
      <Box display={'flex'} gap={2}>
            <DialogModal info = {params.row.action} setMOpen={setMOpen} />
          </Box>
        )
      }
    },

  ];
  const handleGuestEmail = (e) =>{
    setGuestEmail(()=>e.target.value)
    if(gInviteError !== null) setGInviteError(null)
}

  const handleGInviteClose = () => {
    setGOpen(false)
    if(guestEmail !== "") setGuestEmail("")
    if(guestFname !== "") setGuestFname("")
    if(guestFname !== "") setGuestLname("")
}

const handleGuestInviteOpen = () => {
  setGOpen(true)
  getCollegues()
}

const handleDisplayMode = (event, nextValue) => {
  setDisplayMode(nextValue);
};


const InviteGuest = (email, firstname, lastname) =>{
  let valid = true
  if(gInviteError !== null) setGInviteError(null)
  if(gInviteNError !== null) setGInviteNError(null)
  const isEmail = verifyEmail(email)
  const colleguesEmail = [...collegues?.map((c)=>(
       c.key
  ))]
  if(colleguesEmail.includes(email)){
      setGInviteError("This email belongs to one of your collegues, please use the 'Add Collegues' option")
      valid =false
    }
    if(!isEmail){
    setGInviteError("Please enter a valid email")
    valid =false
  }
  if(lastname === "" || firstname === ""){
    valid =false
    setGInviteNError("Please enter the guest first name and last name")
  }
  if(lastname.length<2 || firstname.length<2){
    valid =false
    setGInviteNError("Please enter the guest first name and last name")
  }
  if(valid){
      axios.post(`${api}/guests`,{
        "email": email,
        "company": myInfo.company,
        "fname": firstname,
        "lname": lastname
      }).then(res => {
          // Handle success if needed
          if (res.status === 200) {
              // setIsWaiting(() => false)
              setShowAlert(() => true)
          }
          setGuestEmail("")
          setGuestFname("")
          setGuestLname("")
      })
      .catch(error => {
          if (error.response.status === 409) {
              // setIsWaiting(() => false)
              setShowEAlert(() => true)
          }
      });
  }
}
const guestInviteInput = (
  <Box display={'flex'} flexDirection={'column'} gap={2}>
      <Box display={'flex'} gap={2} justifyContent={'center'} alignItems={'center'} pt={1}>
          <TextField  placeholder='First Name' type='text' value={guestFname} onChange={(e)=>setGuestFname(e.target.value)} />
          <TextField  placeholder='Last Name' type='text' value={guestLname} onChange={(e)=>setGuestLname(e.target.value)} />
      </Box>
      {gInviteNError !== null ? <Typography textAlign={'center'} color={'error'} fontWeight={'bold'} fontSize={'15px'} mt={1}>{gInviteNError}</Typography>:null}
      <Box display={'flex'} gap={2}  alignItems={'center'} pt={1}>
          <TextField  placeholder='Guest email' type='email' sx={{width:'100%'}} value={guestEmail} onChange={handleGuestEmail} />
      </Box>
      {gInviteError !== null ? <Typography textAlign={'center'} color={'error'} fontWeight={'bold'} fontSize={'15px'} mt={1}>{gInviteError}</Typography>:null}
      <Button variant='contained' sx={{width:"10ch", alignSelf:'center'}} onClick={()=>InviteGuest(guestEmail, guestFname, guestLname)}>Add</Button>
  </Box>

)

  return (
    <Box display={"flex"} flexDirection={'column'} gap={"24px"} style={{ width: '100%' }}>
      {myInfo?.role === "Admin"||myInfo?.role === "Owner"?
      <Box display={'flex'} justifyContent={'space-between'} gap={2} alignItems={'center'}>
        <Box display={'flex'} flexDirection={'column'} gap={2}>
          <ToggleButtonGroup
            value={displayMode}
            onChange={handleDisplayMode}
            exclusive
          >
            <ToggleButton value={"users"} aria-label="list-mode">
              <Typography fontWeight={'bold'}>Users</Typography>
            </ToggleButton>
            <ToggleButton value={"guest"} aria-label="card-mode">
              <Typography fontWeight={'bold'}>Guest</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        <ButtonGroup sx={{gap:"20px"}}>
          <DialogModalAddU 
          info={
          {id: "",
          fname: "",
          lname: "",
          email: "",
          role: "User",
          active: false,}
          }  company={myInfo?.company} setMOpen={setMOpen} setContent={setContent}
          />
          <Button startIcon={<AddIcon />} variant='contained' color='warning' sx={{color:'#000'}} onClick={handleGuestInviteOpen}>Add Guest</Button>
      </ButtonGroup>

      </Box>
      :null}
      
    {
            displayMode === 'users'?
            <AccountsGrid rows={data} columns={columns} setMOpen={setMOpen} />
            :
            <GuestGrid rows={guetData} columns={guestColumns} setMOpen={setMOpen} api={api} compId={myInfo.company}/>
        }
      <InviteModalClose1Btn handleAction={handleGInviteClose} open={gOpen} title={"Add Guest"} 
            content={guestInviteInput} btn={"Close"} isAlert={showAlert} isError={showEAlert} 
            contentType="list" alertText={errorText} errorText={errorText} />
			<ModalClose1Btn handleAction={handleClose} open={mOpen} title={"Warning"} content={content} btn={'close'} contentType={"test"} />
    </Box>
  );
}
