import { Typography } from "@mui/material";
import { Box } from "@mui/system";

export default function SettingsOption({ label, caption, children }) {
    return (
      <Box display={'flex'} justifyContent={"space-between"} px={5} alignItems={'center'} gap={2}>
          <Box>
              <Typography variant="body1" fontSize={"18px"}>{label}</Typography>
              {caption?<Typography variant="caption">{caption}</Typography>:null}
          </Box>
          {children}
      </Box>
    );
  }