import { Box, Button, TextField, Typography } from "@mui/material";

const NewFolderForm = ({
  newFolderName,
  handleFolderNameChange,
  handleCreateFolder,
  handleCancelCreation,
  newNameError,
}) => (
  <Box 
    display="flex" 
    flexDirection="column"
    gap={1}
    alignItems="center"
    p={2}
    borderRadius="20px"
    sx={{ boxShadow: "0 1px 5px #ccc" }}
  >
    <TextField
      autoFocus
      // maxWidth="280px"
      value={newFolderName}
      onChange={handleFolderNameChange}
      onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
      placeholder="Type folder name..."
      error={!!newNameError}
    />
    {newNameError && <Typography color="error">A folder with this name already exists</Typography>}
    <Box display="flex" gap={1}>
      <Button variant="contained" color="error" onClick={handleCancelCreation}>
        Cancel
      </Button>
      <Button variant="contained" color="primary" onClick={handleCreateFolder}>
        Save
      </Button>
    </Box>
  </Box>
);

export default NewFolderForm