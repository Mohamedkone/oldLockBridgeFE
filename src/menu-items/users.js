// assets
import { IconAccessPoint, IconArrowsJoin } from "@tabler/icons-react";

// constant


// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const users = {
	id: "user",
	title: "user",
	type: "group",
	children: [
		{
			id:"Bridge",
			title:"Bridge",
			type:"item",
			icon: IconAccessPoint,
			url:"/bridge",
			breadcrumbs: false
		},
		{
			id:"vault",
			title:"vault",
			type:"item",
			icon: IconArrowsJoin,
			url:"/vault",
			breadcrumbs: false
		},
	]
};

export default users;
