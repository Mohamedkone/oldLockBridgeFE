// import { useState } from "react";
// import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
	// Box,
	Button,
	// Checkbox,
	// Divider,
	// FormControl,
	// FormControlLabel,
	// FormHelperText,
	Grid,
	// IconButton,
	// InputAdornment,
	// InputLabel,
	// OutlinedInput,
	// Stack,
	// Typography,
} from "@mui/material";

// third party
// import * as Yup from "yup";
// import { Formik } from "formik";

// project imports
// import useScriptRef from "hooks/useScriptRef";
// assets
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";


import { useAuth0 } from "@auth0/auth0-react";

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ ...others }) => {
	// eslint-disable-next-line no-unused-vars
	const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
	const theme = useTheme();
	// const scriptedRef = useScriptRef();
	// const customization = useSelector((state) => state.customization);
	// const [checked, setChecked] = useState(true);

	const handleLogin = async () => {
		await loginWithRedirect({
			appState: {
				returnTo: "/",
			},
		});
	};


	// const handleEPSign = async () => {
	// 	console.error("EPSign");
	// };

	// const [showPassword, setShowPassword] = useState(false);
	// const handleClickShowPassword = () => {
	// 	setShowPassword(!showPassword);
	// };

	// const handleMouseDownPassword = (event) => {
	// event.preventDefault();
	// };

	return (
		<Grid container direction="column" justifyContent="center" spacing={2}>
			<Grid item xs={12}>
					<Button
						disableElevation
						fullWidth
						onClick={handleLogin}
						size="large"
						variant="outlined"
						sx={{
								color: "grey.700",
								backgroundColor: theme.palette.primary.light[50],
								borderColor: "#000000"
						}	}
					>
						Login
					</Button>
			</Grid>
		</Grid>
	);
};

export default AuthLogin;
