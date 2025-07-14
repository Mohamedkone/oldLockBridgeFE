import { Avatar } from "@mui/material";
import logo from "assets/images/logo.svg";

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
	// return <img src={logo} alt="arrow" style={{ maxHeight: "50px" }} />;
	return <Avatar src={logo} size="lg" sx={{background:'#fff'}} />
};

export default Logo;
