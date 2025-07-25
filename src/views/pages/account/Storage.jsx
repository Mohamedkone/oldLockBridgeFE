import React, { useContext, useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Divider,
    Switch,
    FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { AuthContext } from "context/AuthContext";
import { Cancel, Edit, Save } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { platforms } from "./plateform";


    const Storage = ({setSelectedTab}) => {
        const [selectedPlatform, setSelectedPlatform] = useState(null);
        const [existingStorage, setExistingStorage] = useState(null);
        const [filteredList, setFilteredList] = useState(null);
        const { api, myInfo } = useContext(AuthContext)
        const [formData, setFormData] = useState({});
    const [useSignedUrl, setUseSignedUrl] = useState(false);
    const [expanded, setExpanded] = useState(null);
    const [ editing, setEditing ] = useState(false)
    const [ removeList, setRemoveList ] = useState([])
    const [ removeApiList, setRemoveApiList ] = useState([])
    const [ds, setDs] = useState(null)
    const navigate = useNavigate()

    const connectGoogleDrive = () => {
        const clientId = "304417414909-h29cj5ubvjppk6j2ftdj67otsp66rhqk.apps.googleusercontent.com";
        const redirectUri = `http://localhost:3000/callbackss`;
        const scope = "https://www.googleapis.com/auth/drive.file";
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
        window.location.href = authUrl;
    };
    const connectDropbox = () => {
        const clientId = "hvrwt9jed00sv3v";
        const redirectUri = `http://localhost:3000/callbacksdrop`;
        const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&token_access_type=offline
`;
        window.location.href = authUrl;
    };
    
    useEffect(()=>{
        const fetch = async() =>{
            const main = []
            await axios.get(`${api}/api-storages/${myInfo.id}`).then((res)=>{
                for(let x of res.data){
                    const storage = {
                        id: x.id,
                        alias: `${x.platform} storage`,
                        platform: x.platform
                    }
                    main.push(storage)
                    console.log(storage)
                }
            })
            await axios.get(`${api}/mystorages/${myInfo.id}`).then((res)=>{

                for(let x of res.data){
                    const dbStorage ={
                        id: x.id,
                        alias: x.alias,
                        platform: x.platform,
                    }
                    main.push(dbStorage)
                }
            })
            axios.get(`http://localhost:3001/ds/${myInfo.id}`).then((res)=>{
                setDs(res.data)
                console.log(res.data)
            })
            setExistingStorage([...main])
            setFilteredList([...main])
        }
        if(myInfo?.id)
        fetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[myInfo])

    useEffect(()=>{
        FilterList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[removeList])

    const handleSelectPlatform = (platformKey) => {
        setSelectedPlatform(platformKey);
        setFormData({});
        setUseSignedUrl(false); // Reset signed URL toggle
    };

    const handleInputChange = (key, value) => {
        setFormData((prevState) => ({
        ...prevState,
        [key]: value,
        }));
    };

    const handleSaveStorage = () => {
        const newStorage = {
            id: existingStorage.length + 1,
            alias: formData.alias || "Unnamed Storage",
            platform: platforms[selectedPlatform].name,
            details: formData,
        };
        sendToDb()
        setExistingStorage((prev) => [...prev, newStorage]);
        setSelectedPlatform(null);
    };

    const sendToDb = () =>{
        // console.log(formData["Endpoint URL"],
        //     formData["Access Key ID"],
        //     formData["Secret Access Key"],
        //     formData["Bucket Name"],
        //     formData["Region"],)
        axios.post(`${api}/storages`,{
            id: toString(existingStorage.length + 1),
            alias: formData.alias,
            system: platforms[selectedPlatform].name,
            ownerId: myInfo.id,
            access: {
                endpoint: formData["Endpoint URL"],
                accessKeyId: formData["Access Key ID"],
                secretAccessKey: formData["Secret Access Key"],
                bucketName: formData["Bucket Name"],
                region: formData["Region"],
            }
        }).then(()=>
            window.location.reload()
        )
    }

    const handleEditing = () => {
        setEditing(!editing)
    }

    const handleCancel = () =>{
        setRemoveList(()=>[])
        setRemoveApiList(()=>[])
        setEditing(false)
    }
    
    const handleSave = async() =>{
        try{
                if(removeList){
                    await axios.delete(`${api}/storages`,{
                        data:removeList
                    })
                }
                if(removeApiList){
                    for(let x of removeApiList){
                        await axios.delete(`${api}/api-storages/${x}`)
                    }
                }
                window.location.reload()
            }catch{

            }
    }

    const ToBeRemove = (newId) => {
        setRemoveList((prev)=>[...prev, newId])
    }
    const ApiToBeRemove = (newId) => {
        setRemoveApiList((prev)=>[...prev, newId])
    }
    const FilterList = () => {
        setFilteredList(existingStorage?.filter((x)=> !removeList.includes(x.id)))
    }

    const handleMembership = () =>{
        navigate('/account?tab=4')
        setSelectedTab(4)
    }

    const oAuthChoice = (name) =>{
        if (name === 'Dropbox') connectDropbox()
        else connectGoogleDrive()
    }

    const formatBytes = (bytes) => {
        if (bytes < 0) return 'Invalid value';
        if (bytes === 0) return '0 Bytes';
      
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
        const base = 1000; // Use 1024 for binary (IEC) conversion
      
        const i = Math.floor(Math.log(bytes) / Math.log(base));
      
        const value = (bytes / Math.pow(base, i)).toFixed(2); // 2 decimal places
      
        return `${parseFloat(value)} ${units[i]}`;
      }

    const handleOpenStorageCard = (storage) => {
    // Toggle the expanded state: if the card is already expanded, collapse it (set expanded to null).
    // If the card is not expanded, set the expanded state to the current storage ID and platform.
    console.log(storage)
    setExpanded((prevExpanded) => 
        prevExpanded?.id === storage.id ? null : storage
    );
};
console.log(existingStorage)

    return (
        <Box p={4} display={'flex'} flexDirection={'column'} gap={2}>
        <Typography variant="h3" gutterBottom>
            Storage Integrations
        </Typography>
        <Box
            display={'flex'}
            flexDirection={'column'}
        >
        <Typography variant="h4" gutterBottom>
            Vault Storage
        </Typography>
        <Box
            display={'flex'}
            // flexDirection={'column'}
            justifyContent={'space-evenly'}
            alignItems={"center"}
            sx={{
                background: "none",
                boxShadow: "0 1px 5px #ccc",
                minWidth: "calc(min(300px, 90dvw))",
                minHeight: "100px"
            }}
        >
            <Box
                display={'flex'}
                flexDirection={'column'}
            >
                <Typography variant="h5">Storage Type</Typography>
                <Typography fontWeight={'bold'}>{ds?ds.type:'---'}</Typography>

            </Box>
            <Box
                display={'flex'}
                flexDirection={'column'}
            >
                <Typography variant="h5">Capacity</Typography>
                <Typography fontWeight={'bold'}>{ds? formatBytes(ds.size):'--'}</Typography>

            </Box>
            <Box
                display={'flex'}
                flexDirection={'column'}
            >
                <Typography variant="h5">Region</Typography>
                <Typography fontWeight={'bold'}>US-1</Typography>

            </Box>
            <Box
                display={'flex'}
                flexDirection={'column'}
            >
                <Button
                    variant="contained" 
                    color="myBlue"
                    sx={{color:"#fff"}}
                    onClick={()=>handleMembership()}
                >
                    Manage Plan
                </Button>
            </Box>

        </Box>
        </Box>
        <Box 
            display={'flex'} 
            justifyContent={'space-between'}
        >
            <Typography variant="h4" mt={3}>
                Existing Storage
            </Typography>
            {editing?
                <Box
                    sx={{
                        display: 'flex',
                        gap:2,
                    }}>
                    <Button 
                    startIcon={<Cancel />}
                    variant="contained"
                    color="error"
                    onClick={()=>handleCancel()}
                    >
                        Cancel
                    </Button>
                    <Button 
                        startIcon={<Save />}
                        variant="contained"
                        color="primary"
                        onClick={()=>handleSave()}
                    >
                        Save
                    </Button>
                </Box>
                :
                <Button 
                    startIcon={<Edit />}
                    variant="contained"
                    color="myBlue"
                    sx={{color:"#fff"}}
                    onClick={()=>handleEditing()}
                >
                    Edit
                </Button>
            }
        </Box>
        <Box
            display={"flex"} gap={3} flexWrap={"wrap"}
        >
        {filteredList?filteredList?.map((storage) => (
            <Box key={storage.id} mt={2}>
            <Card sx={{ 
                background: "none",
                boxShadow: "0 1px 5px #ccc",
                width: "calc(min(300px, 90dvw))",
                maxWidth:"400px"
            }}>
                <CardContent 
                    onClick={() => handleOpenStorageCard(storage)}
                    sx={{
                        cursor:"pointer",
                        textAlign:"center"
                    }}
                >
                <Typography variant="h4">{storage.alias}</Typography>
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>

                <Typography variant="caption">{storage.platform}</Typography>
                <ExpandMoreIcon  />
                </Box>
                {expanded?.id === storage.id && (
                    ['Drive', 'Dropbox', 'OneDrive'].includes(expanded?.platform)?
                    <Box>
                    <Typography>Connected</Typography>
                    {editing && 
                    <Button 
                    variant="contained" 
                    color="error"
                    onClick={()=>ApiToBeRemove(storage.id)}
                    >   
                        Delete
                    </Button>
                    }
                    </Box>
                    :
                    <Box mt={2}>
                    {/* {Object.entries(storage.details).map(([key, value]) => (
                        <TextField
                        key={key}
                        label={key}
                        value={key !== "alias" ? "*****" : value}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        disabled
                        />
                    ))} */}
                    <Typography>Connected</Typography>
                    
                    {editing && 
                    <Button 
                    variant="contained" 
                    color="error"
                    onClick={()=>ToBeRemove(storage.id)}
                    >   
                        Delete
                    </Button>
                    }
                    </Box>
                    
                )}
                </CardContent>
            </Card>
            </Box>
        )):null}
        </Box>



        <Divider sx={{ my: 4 }} />

        {/* Add New Storage */}
        <Typography variant="h4">Add New Storage</Typography>
        {!selectedPlatform ? (
            <Grid container spacing={2} mt={2}>
            {Object.entries(platforms).map(([key, platform]) => (
                <Grid item xs={6} sm={4} md={3} key={key}>
                <Card
                    onClick={platform.available?() => handleSelectPlatform(key):null}
                    sx={{
                    background: !platform.available ? "#999" : platform.bkc,
                    border: "1px solid #ccc",
                    cursor:  `${!platform.available ? "not-allowed" : "pointer"}`,
                    textAlign: "center",
                    p: 2,
                    }}
                >
                    <CardContent>
                    <Typography fontWeight={"bold"} color={platform.color}>
                        {platform.name}
                    </Typography>
                    <Typography
                        variant="caption"
                        color={platform.color}
                    >
                        {platform.caption}
                    </Typography>
                   {!platform.available && <Typography fontWeight={"bold"} color={platform.color}>
                        Coming Soon...
                    </Typography>}
                    </CardContent>
                </Card>
                </Grid>
            ))}
            </Grid>
        ) : (
            <Box mt={3}>
            <Typography variant="h6">{platforms[selectedPlatform].name}</Typography>
            {platforms[selectedPlatform].inputs.oauth ? (
                <Box mt={2}>
                <Button
                    variant="contained"
                    color="primary"
                    // onClick={() => handleOAuthConnect(platforms[selectedPlatform].name)}
                    onClick={() => oAuthChoice(platforms[selectedPlatform].name)}
                >
                    Connect with {platforms[selectedPlatform].name}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setSelectedPlatform(null)}
                    sx={{ ml: 2 }}
                >
                    Cancel
                </Button>
                </Box>
            ) : (
                <>
                <TextField
                    label="Alias"
                    value={formData.alias || ""}
                    onChange={(e) => handleInputChange("alias", e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

                {/* Toggle for AWS/S3 Compatible: Keys vs Signed URL */}
                {["aws", "s3Compatible"].includes(selectedPlatform) && (
                    <FormControlLabel
                    control={
                        <Switch
                        checked={useSignedUrl}
                        onChange={(e) => setUseSignedUrl(e.target.checked)}
                        />
                    }
                    label="Use Signed URL"
                    />
                )}

                {/* Dynamic Inputs */}
                {platforms[selectedPlatform].inputs[useSignedUrl ? "signedUrl" : "keys"].map((input) => (
                    <TextField
                    key={input}
                    label={input}
                    value={formData[input] || ""}
                    onChange={(e) => handleInputChange(input, e.target.value)}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    />
                ))}

                <Box mt={2}>
                    <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveStorage}
                    disabled={!formData.alias} // Ensure alias is set before saving
                    >
                    Save Storage
                    </Button>
                    <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setSelectedPlatform(null)}
                    sx={{ ml: 2 }}
                    >
                    Cancel
                    </Button>
                </Box>
                </>
            )}
            </Box>
        )}
        </Box>
    );
};

export default Storage;