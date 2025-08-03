// assets
import { IconAccessPoint, IconArrowsJoin, IconLockOpen, IconRotate } from "@tabler/icons-react";

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
		// {
		// 	id:"vault",
		// 	title:"Vault",
		// 	type:"item",
		// 	icon: IconArrowsJoin,
		// 	url:"/vault",
		// 	breadcrumbs: false
		// },
		{
			id:"generate",
			title:"Generate",
			type:"item",
			icon: IconRotate,
			url:"/generate",
			breadcrumbs: false
		},
		{
			id:"decrypt",
			title:"Decrypt",
			type:"item",
			icon: IconLockOpen,
			url:"/decrypt",
			breadcrumbs: false
		},
	]
};

export default users;
