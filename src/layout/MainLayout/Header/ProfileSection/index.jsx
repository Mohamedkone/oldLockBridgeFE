import { useState, useRef, useEffect, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
	Avatar,
	Box,
	ClickAwayListener,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Popper,
	Stack,
	Typography
} from "@mui/material";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";

// assets
import { IconLogout, IconSettings } from "@tabler/icons-react";
import { AuthContext } from "context/AuthContext";
import { useAuth0 } from "@auth0/auth0-react";

// ==============================|| PROFILE MENU ||============================== //

const ProfileSection = ({userData}) => {
	const theme = useTheme();
	const customization = useSelector((state) => state.customization);
	const navigate = useNavigate();
	const { handleLogout } = useContext(AuthContext)
	const { user } = useAuth0()


	const [selectedIndex, setSelectedIndex] = useState(-1);
	const [open, setOpen] = useState(false);
	/**
	 * anchorRef is used on different componets and specifying one type leads to other components throwing an error
	 * */
	const anchorRef = useRef(null);

	const handleClose = (event) => {
		if (anchorRef.current && anchorRef.current.contains(event.target)) {
			return;
		}
		setOpen(false);
	};

	const handleListItemClick = (event, index, route = "") => {
		setSelectedIndex(index);
		handleClose(event);

		if (route && route !== "") {
			navigate(route);
		}
	};
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen);
	};

	const prevOpen = useRef(open);
	useEffect(() => {
		if (prevOpen.current === true && open === false) {
			anchorRef.current.focus();
		}

		prevOpen.current = open;
	}, [open]);
	return (
		<>
			<Avatar
				src={userData.uAvatar}
				sx={{
					...theme.typography.mediumAvatar,
					cursor: "pointer",
					width:40,
					height:40,
					border:"1px solid #000"
				}}
				ref={anchorRef}
				aria-controls={open ? "menu-list-grow" : undefined}
				aria-haspopup="true"
				color="inherit"
				onClick={handleToggle}
			/>

			<Popper
				placement="bottom-end"
				open={open}
				anchorEl={anchorRef.current}
				role={undefined}
				transition
				disablePortal={[theme.breakpoints.up("md")]?false:true}
				popperOptions={{
					modifiers: [
						{
							name: "offset",
							options: {
								offset: [0, 14]
							}
						}
					]
				}}
			>
				{({ TransitionProps }) => (
					<Transitions in={open} {...TransitionProps}>
							<ClickAwayListener onClickAway={handleClose}>
								<MainCard  border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
									<Box sx={{ p: 2 }}>
										<Stack>
											<Stack direction="row" spacing={0.5} alignItems="center">
												<Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
													{userData.uName}
												</Typography>
											</Stack>
											<Typography variant="subtitle2">{userData.uRole}</Typography>
										</Stack>
									</Box>
									<PerfectScrollbar style={{ height: "100%", maxHeight: "calc(100vh - 250px)", overflowX: "hidden" }}>
										<Box sx={{ p: 2 }}>
											<List
												component="nav"
												sx={{
													width: "100%",
													maxWidth: 350,
													minWidth: 300,
													backgroundColor: "#FFF",
													borderRadius: "10px",
													[theme.breakpoints.down("md")]: {
														minWidth: "100%"
													},
													"& .MuiListItemButton-root": {
														mt: 0.5
													}
												}}
											>
												{!user?.isGuest ? <ListItemButton
													sx={{ borderRadius: `${customization.borderRadius}px` }}
													selected={selectedIndex === 0}
													onClick={(event) => handleListItemClick(event, 0, "account")}
												>
													<ListItemIcon>
														<IconSettings stroke={1.5} size="1.3rem" />
													</ListItemIcon>
													<ListItemText primary={<Typography variant="body2">Account Settings</Typography>} />
												</ListItemButton>
												:
												null
												}
												<ListItemButton
													sx={{ borderRadius: `${customization.borderRadius}px` }}
													selected={selectedIndex === 4}
													onClick={()=>handleLogout()}
												>
													<ListItemIcon>
														<IconLogout stroke={1.5} size="1.3rem" />
													</ListItemIcon>
													<ListItemText primary={<Typography variant="body2">Logout</Typography>} />
												</ListItemButton>
											</List>
										</Box>
									</PerfectScrollbar>
								</MainCard>
							</ClickAwayListener>
					</Transitions>
				)}
			</Popper>
		</>
	);
};

export default ProfileSection;
