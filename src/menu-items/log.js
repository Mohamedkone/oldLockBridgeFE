// assets
import { IconTransfer } from "@tabler/icons-react";

// constant


// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const log = {
	id: "log",
	title: "Log",
	type: "group",
	children: [
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

export default log;
