import { Link, useLocation } from "react-router-dom";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Divider, Grid, Stack, Typography, useMediaQuery } from "@mui/material";

// project imports
import AuthWrapper1 from "../AuthWrapper1";
import AuthCardWrapper from "../AuthCardWrapper";
import AuthLogin from "../auth-forms/AuthLogin";
import Logo from "ui-component/Logo";
import CopyWriteFooter from "ui-component/cards/CopyWriteFooter";
import { useEffect, useState } from "react";
import ModalClose1Btn from "ui-component/modals/ModalClose1Btn";

// assets

// ================================|| AUTH3 - LOGIN ||================================ //

const Login = () => {
	const theme = useTheme();
	const matchDownSM = useMediaQuery(theme.breakpoints.down("md"));
	const [mOpen, setMOpen] = useState(false)
	const location = useLocation()

	useEffect(()=>{
		if(location.state !== null && location?.state?.error === 401 ) setMOpen(true)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	},[])

	const handleClose = () =>{
		setMOpen(false)
		location.state =null
		window.history.replaceState({}, '')
	}

	return (
		<AuthWrapper1>
			<Grid container direction="column" justifyContent="flex-end" sx={{ minHeight: "100vh" }}>
				<Grid item xs={12}>
					<Grid container justifyContent="center" alignItems="center" sx={{ minHeight: "calc(100vh - 68px)" }}>
						<Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
							<AuthCardWrapper>
								<Grid container spacing={2} alignItems="center" justifyContent="center">
									<Grid item sx={{ mb: 3 }}>
										<Link to="#">
											<Logo />
										</Link>
									</Grid>
									<Grid item xs={12}>
										<Grid container direction={matchDownSM ? "column-reverse" : "row"} alignItems="center" justifyContent="center">
											<Grid item>
												<Stack alignItems="center" justifyContent="center" spacing={1}>
													<Typography color={theme.palette.primary.main} gutterBottom variant={matchDownSM ? "h3" : "h2"}>
														Welcome
													</Typography>
													<Typography variant="caption" fontSize="16px" textAlign={matchDownSM ? "center" : "inherit"}>
														Login to continue
													</Typography>
												</Stack>
											</Grid>
										</Grid>
									</Grid>
									<Grid item xs={12}>
										<AuthLogin />
									</Grid>
									<Grid item xs={12}>
										<Divider />
									</Grid>
								</Grid>
							</AuthCardWrapper>
						</Grid>
					</Grid>
				</Grid>
				<Grid item xs={12} sx={{ m: 3, mt: 1 }}>
					<CopyWriteFooter />
				</Grid>
			</Grid>
			{location.state!== null?
			<ModalClose1Btn handleAction={handleClose} open={mOpen} title={location.state.error} content={location.state.error_description} btn="Close" contentType="text"/>
			:null
			}
		</AuthWrapper1>
	);
};

export default Login;
