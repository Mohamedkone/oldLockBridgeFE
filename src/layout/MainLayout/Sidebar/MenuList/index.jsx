// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "context/AuthContext";
import { useAuth0 } from "@auth0/auth0-react";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
	const {myInfo} = useContext(AuthContext)
	const {user} = useAuth0()
	const [menu, setMenu] = useState([])

	useEffect(()=>{
		if(myInfo?.role) {
			if(myInfo?.role === "User")setMenu(()=>menuItem.items.filter((d)=>d.id === "user"))
			else if(myInfo?.role === "Moderator") setMenu(()=>menuItem.items.filter((d)=>d.id === "log" || d.id === "user"))
			else if(myInfo?.role === "Auditor") setMenu(()=>menuItem.items.filter((d)=>d.id === "admin"))
			else if(myInfo?.role === "Admin" || myInfo?.role === "Owner") setMenu(()=>menuItem.items.filter((d)=>d.id === "admin" || d.id === "user"))
		}
		else if(user?.isGuest){
			setMenu(()=>menuItem.items.filter((d)=>d.id === "guest"))
		}
	}, [myInfo, user])
	
	const navItems = menu.map((item) => {
		switch (item.type) {
			case "group":
				return <NavGroup key={item.id} item={item} />;
			default:
				return (
					<Typography key={item.id} variant="h6" color="error" align="center">
						Menu Items Error
					</Typography>
				);
		}
	});

	return <>{navItems}</>;
};

export default MenuList;
