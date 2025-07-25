// components/Finder/ActionButtons.jsx
import { Button, Box } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
// import UploadIcon from "@mui/icons-material/Upload";
import PropTypes from "prop-types";

const ActionButtons = ({ 
  handlePrevious, 
  handleNewFolderClick, 
  isPreviousDisabled 
}) => (
  <Box display="flex" justifyContent="space-between">
    <Button
      variant="outlined"
      startIcon={<ArrowBackIcon />}
      onClick={handlePrevious}
      disabled={isPreviousDisabled}
      sx={{ m: 0, width: "max-content" }}
    >
      Previous
    </Button>
    <Box display="flex" gap={1}>
      <Button
        variant="contained"
        color="myBlue"
        startIcon={<AddIcon />}
        onClick={handleNewFolderClick}
        sx={{ m: 0, width: "max-content", color: "#fff" }}
      >
        New Folder
      </Button>
      {/* <Button
        variant="contained"
        startIcon={<UploadIcon />}
        sx={{ m: 0, width: "max-content", color: "#fff" }}
      >
        Upload
      </Button> */}
    </Box>
  </Box>
);

ActionButtons.propTypes = {
  handlePrevious: PropTypes.func.isRequired,
  handleNewFolderClick: PropTypes.func.isRequired,
  isPreviousDisabled: PropTypes.bool.isRequired,
};

export default ActionButtons;