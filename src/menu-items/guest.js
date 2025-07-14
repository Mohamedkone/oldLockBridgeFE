// assets
import { IconArrowsJoin } from "@tabler/icons-react";

// constant


// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const guest = {
	id: "guest",
	title: "guest",
	type: "group",
	children: [
		{
			id:"room-join",
			title:"Join",
			type:"item",
			icon: IconArrowsJoin,
			url:"/join",
			breadcrumbs: false
		},

	]
};

export default guest;
