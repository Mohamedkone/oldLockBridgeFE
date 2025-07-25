// assets
import { IconDashboard, IconTransfer, IconUserHexagon } from "@tabler/icons-react";

// constant


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const admin = {
	id: "admin",
	title: "Admin",
	type: "group",
	children: [
		{
			id: "admin",
			title: "Admin",
			type: "item",
			url: "/admin",
			icon: IconUserHexagon,
			breadcrumbs: false
		},
		{
			id: "default",
			title: "Dash",
			type: "item",
			url: "/",
			icon: IconDashboard,
			breadcrumbs: false
		},

		{
			id: "transfers",
			title: "Logs",
			type: "item",
			url: "/transfers",
			icon: IconTransfer,
			breadcrumbs: false
		}
	]
};

export default admin;
