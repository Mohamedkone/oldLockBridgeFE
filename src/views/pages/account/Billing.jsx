import React,{useContext, useEffect, useState} from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import axios from 'axios'
import { AuthContext } from "context/AuthContext";
import PricingTable from "ui-component/PricingTable";
import PriceModal from "ui-component/modals/PriceModal";

const Billing = () => {
    const {myInfo} = useContext(AuthContext)
    const [plan, setPlan] = useState({})
    const [list, setList] = useState([])
    const [mOpen, setMOpen] = useState(false)

    const handleClose = () =>{
        setMOpen(false)
    }
    const handleOpen = () =>{
        setMOpen(true)
    }

    useEffect(()=>{
        if(!myInfo) return
        axios.get(`http://localhost:3001/plans/${myInfo.plan}`).then((res)=>{
            setPlan({id: res.data.id,plan:res.data.plan})
        })
        axios.get(`http://localhost:3001/billings/${myInfo.id}`).then((res)=>{
            setList(res.data)
            console.log(res.data)
        })
        
    },[myInfo])

    return (
        <Box p={4}>
        <Grid container spacing={4}>
            {/* Active Plan */}
            <Grid item xs={12} md={8}>
            <Card
                sx={{
                    background:"#fff",
                    boxShadow: "0px 1px 5px #ccc"
                }}
            >
                <CardContent>
                <Box display="flex" justifyContent="space-evenly" alignItems="center">
                    <Typography variant="h6">{plan?.plan} Plan</Typography>
                    <Box>
                    <Typography variant="subtitle1" color="textSecondary">
                        Personal
                    </Typography>
                    <Typography variant="h4" mt={2}>
                        $5 <Typography variant="subtitle1" component="span">per month</Typography>
                    </Typography>
                    <Typography variant="subtitle2" mt={1}>
                        5 Devices
                    </Typography>
                    </Box>
                    <Box display={"flex"} flexDirection={"column"} gap={2}>
                        <Button 
                            variant="contained" 
                            color="secondary"
                            sx={{color:"#fff"}}
                            disabled={plan?.id === "plan36234"}
                            onClick={handleOpen}
                            >
                        Downgrade Plan
                        </Button>
                        <Button 
                            variant="contained" 
                            color="primary"
                            sx={{color:"#fff"}}
                            disabled={plan?.id === "plan51843"}
                            onClick={handleOpen}
                            >
                        Upgrade Plan
                        </Button>
                    </Box>
                </Box>
                </CardContent>
            </Card>
            </Grid>

            {/* Payment Method */}
            <Grid item xs={12} md={4}>
                <Card
                    sx={{
                        background:"#fff",
                        boxShadow: "0px 1px 5px #ccc"
                    }}
                >
                    <CardContent>
                    <Typography variant="h6">Payment Method</Typography>
                    <Typography variant="subtitle1" mt={1}>
                        Visa ending in 1234
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Expiry 06/2024
                    </Typography>
                    <Typography variant="body2" mt={1}>
                        billing@untitledui.com
                    </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        {/* Billing History */}
        <Box mt={4}>
            <Typography variant="h6">Billing History</Typography>
            <TableContainer
                mt={2}>
            <Table>
                <TableHead>
                <TableRow>
                    <TableCell>Invoice</TableCell>
                    <TableCell>Billing Date</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Plan</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {list?.map((invoice,i) => {
                    const newDate = invoice.addedDate.split("T")[0]
                    return(
                    <TableRow key={i}>
                    <TableCell>Invoice #{invoice.invoiceId}</TableCell>
                    <TableCell>{newDate}</TableCell>
                    <TableCell>{invoice.amount}</TableCell>
                    <TableCell>Basic</TableCell>
                    <TableCell>{invoice.status}</TableCell>
                    <TableCell>
                        <IconButton color="primary">
                        <DownloadIcon />
                        </IconButton>
                    </TableCell>
                    </TableRow>
                )})}
                </TableBody>
            </Table>
            </TableContainer>
            <Box mt={2} textAlign="right">
            <Button variant="contained" color="warning">
                Download All
            </Button>
            </Box>
        </Box>
        <PriceModal 
        btn={'close'}
        content={<PricingTable currentPlan={plan?.id} />}
        handleAction={handleClose}
        open={mOpen}
        title={'Subscription'}
        contentType="Box"
        />
        </Box>
    );
};

export default Billing;
