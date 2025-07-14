import React from "react";
import { Button, Box, useTheme } from "@mui/material";
import { Add } from "@mui/icons-material";

const Header = ({handleOpen, bText}) => {
const theme = useTheme()
  return (
    <Box display="flex" justifyContent="right" my={2}>
        <Button variant="contained" 
        color="orange"
        sx={{color:"#fff", 
        backgroundColor: theme.palette.orange.dark,
        }}
        startIcon={<Add />}
        onClick={handleOpen}
        >
            {bText}
        </Button>
    </Box>
  );
};

export default Header;
