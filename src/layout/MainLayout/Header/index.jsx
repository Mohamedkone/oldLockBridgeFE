import PropTypes from "prop-types";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

// project imports
import LogoSection from "../LogoSection";
import ProfileSection from "./ProfileSection";

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ userData }) => {
	const theme = useTheme();

	return (
		<>
			{/* logo & toggler button */}
			<Box
				sx={{
					width: 228,
					display: {xs:"flex", md:"none"},
					[theme.breakpoints.down("md")]: {
						width: "auto"
					}
				}}
			>
				<Box component="span" sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}>
					<LogoSection />
				</Box>
			</Box>

			{/* header search */}

			<Box sx={{ flexGrow: 1 }} />
			<Box sx={{ flexGrow: 1 }} />

			{/* profile */}
			<ProfileSection userData={userData} />
		</>
	);
};

Header.propTypes = {
	handleLeftDrawerToggle: PropTypes.func
};

export default Header;
