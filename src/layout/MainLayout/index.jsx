import {  useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

// material-ui
import { styled, useTheme } from "@mui/material/styles";
import { Box, CssBaseline, Divider, Typography, useMediaQuery } from "@mui/material";

// project imports
// import Breadcrumbs from "ui-component/extended/Breadcrumbs";
import Sidebar from "./Sidebar";
// import Customization from '../Customization';
// import navigation from "menu-items";
import { drawerWidth } from "store/constant";

// assets
// import { IconChevronRight } from "@tabler/icons-react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { useCookies } from "react-cookie";
import { AuthContext } from "context/AuthContext";
import ModalClose1Btn from "ui-component/modals/ModalClose1Btn";
import ProfileSection from "./Header/ProfileSection";
import MobileNav from "./mobilenav";
import CopyWriteFooter from "ui-component/cards/CopyWriteFooter";

// styles
const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" && prop !== "theme" })(({ theme, open }) => ({
	...theme.typography.mainContent,
	borderTopLeftRadius: 0,
	borderTopRightRadius: 0,
	borderBottomLeftRadius: 0,
	borderBottomRightRadius: 0,
	background: "#fff",
	borderBottom: "none",
	height:"calc(95% - 75px)",
	padding: "30px 40px",
	transition: theme.transitions.create(
		"margin",
		open
			? {
				easing: theme.transitions.easing.easeOut,
				duration: theme.transitions.duration.enteringScreen
			}
			: {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen
			}
	),
	[theme.breakpoints.up("md")]: {
		margin:`0 0 0 0`,
		marginLeft: open ? 0 : -(drawerWidth - 20),
		width: `calc(95% - ${drawerWidth}px)`,
	},
	[theme.breakpoints.down("md")]: {
		width: '100dvw',
		marginLeft: "0",
		marginTop: "0",
		// marginRight: "10px",
		padding: "16px"
	},
	// [theme.breakpoints.down("sm")]: {
	// 	marginLeft: "10px",
	// 	width: `calc(100% - ${drawerWidth}px)`,
	// 	padding: "16px",
	// 	marginRight: "10px"
	// }
}));

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
	const theme = useTheme();
	const { myInfo, setMyInfo, api, pageTitle, setCompSettings } = useContext(AuthContext)
	const { user, isAuthenticated } = useAuth0()
	const [open, setOpen] = useState(false)
	const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));
	// eslint-disable-next-line no-unused-vars
	const [cookies, setCookie] = useCookies();
	const { handleLogout } = useContext(AuthContext)
	const location = window.location
	// if(location.search.includes("?code")) window.location.href='/'

	const handleClose = () => {
		setOpen(() => false)
	}

	// Handle left drawer
	const leftDrawerOpened = useSelector((state) => state.customization.opened);


	useEffect(() => {
		if (!isAuthenticated) {
			return;
		}

		let isMount = true;
		const source = axios.CancelToken.source();

		 
		const getUser = async () => {
			try {
				const res = await axios.get(`${api}/login/${user.sub}`, {
					cancelToken: source.token
				}).catch((err) => {
					handleLogout()
				});
				if (isMount) {
					if(res.data?.main.active === false){
						handleLogout()
					}
					setMyInfo(() => res.data?.main);
					if (res.data.token !== null) {
						setCookie('auth-r-key', res.data.token, { path: '/', maxAge: 36000 });
						// axios.get(`${api}/comp-settings/${res.data?.main.company}`,{
						// 	headers:{
						// 		'authorization':  res.data.token
						// 	}
						// }).then((res)=>{
						// 	setCompSettings(res.data)
						// })
					}
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request canceled:', error.message);
				} else {
					handleLogout()
				}
			}
		};
		const getGuest = async () => {
			try {
				const res = await axios.get(`${api}/guestLogin/${user.email.toLowerCase()}`, {
					cancelToken: source.token
				}).catch((err) => {
					handleLogout()
				})
				if (isMount) {
					setMyInfo(() => res.data?.main);
					if (res.data.token !== null) {
						setCookie('auth-r-key', res.data.token, { path: '/', maxAge: 36000 });
					}
				}
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log('Request canceled:', error.message);
				} else {
					handleLogout()
				}
			}
		};

		if (isMount && isAuthenticated) {
			if(user.isGuest) getGuest()
			else getUser();
		}

		return () => {
			isMount = false;
			source.cancel('Component unmounted: Canceling request');
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, isAuthenticated])
	// if(location.search.includes("?code"))
	// return<></>

	return (
		<Box sx={{ display: "flex", overflow:"none", flexDirection:{xs:"column", md:"row"}, justifyContent:{xs:"space-between" ,md:"unset"}, height:"100dvh"}} position={"relative"}>
			<CssBaseline />
			{/* header */}


			{/* drawer */}
			<Sidebar drawerOpen={!matchDownMd ? leftDrawerOpened : !leftDrawerOpened}  />

			{/* main content */}
			<Main theme={theme} open={true} sx={{height:{xs:'80dvh', md:"100dvh"}}}>
				{/* breadcrumb */}
				{/* <Breadcrumbs separator={IconChevronRight} navigation={navigation} icon title rightAlign /> */}
				<Box display={'flex'}  mb={{xs:"40px", md: "none"}} justifyContent={'space-between'}>
					<Typography variant="h1">{pageTitle}</Typography>
					<Box display={'flex'} gap={"16px"}>
						<Divider orientation="vertical" flexItem sx={{borderWidth:"1px"}}/>
						<ProfileSection userData={{ uName: `${myInfo?.fname} ${myInfo?.lname}`, uRole: myInfo?.role, uAvatar: myInfo?.avatar }} />
					</Box>
				</Box>
				<Box sx={{overflowY:"auto"}} maxHeight={"90%"} paddingBottom={"75px"}>
					<Outlet />
				</Box>
			<CopyWriteFooter />
			</Main>
			<Box position={"fixed"}  bottom={0} display={{xs:'flex', md:"none"}} width={'100%'} bgcolor={"#172338"} height={'75px'} justifyContent={'center'} >
				<MobileNav />
			</Box>
			<ModalClose1Btn handleAction={handleClose} open={open} title={"Warning"} content={"We have encoutered and issue, please try again. If the issue continue, please contact us"} btn={'close'} contentType={"test"} />
			{/* <Customization /> */}
		</Box>
	);
};

export default MainLayout;
