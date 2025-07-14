// material-ui
import { Link, Typography, Stack } from "@mui/material";

// ==============================|| FOOTER - AUTHENTICATION 2 & 3 ||============================== //

const CopyWriteFooter = () => (
	<Stack 
	sx={{position:"absolute", bottom:1, right:2}} 
	direction="row" justifyContent="end">
		<Typography variant="subtitle" component={Link} href="https://lockbridge.io" target="_blank" underline="hover">
			&copy; Lockbridge.io
		</Typography>
	</Stack>
);

export default CopyWriteFooter;
