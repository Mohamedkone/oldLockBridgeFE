import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  IconButton,
  Divider,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PropTypes from "prop-types";

const MoveModal = ({ open, onClose, fileSystem, currentItem, onMove }) => {
  const [currentParentId, setCurrentParentId] = useState("root");
  const [breadcrumbs, setBreadcrumbs] = useState([{ id: "root", name: "Root" }]);

  // Check if current location is the item's existing parent
  const isSameLocation = currentItem?.parentId === currentParentId;

  const getFoldersByParentId = (parentId) => {
    // Handle both array and object formats
    const items = Array.isArray(fileSystem) ? fileSystem : Object.values(fileSystem);
    return items.filter(
      (item) => item.parentId === parentId && item.type === "folder"
    );
  };

  const handleFolderClick = (folder) => {
    setCurrentParentId(folder.id);
    setBreadcrumbs((prev) => [...prev, folder]);
  };

  const handleBreadcrumbClick = (index) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    setCurrentParentId(newBreadcrumbs[index].id);
  };

  const handleMove = () => {
    if (isSameLocation) return;
    onMove(currentParentId);
    resetModal();
  };

  const resetModal = () => {
    setCurrentParentId("root");
    setBreadcrumbs([{ id: "root", name: "Root" }]);
    onClose();
  };

  return (
    <Modal open={open} onClose={resetModal}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6">
            Move <strong>{currentItem?.name}</strong>
          </Typography>
        </Box>

        {/* Breadcrumbs */}
        <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton
            size="small"
            disabled={currentParentId === "root"}
            onClick={() => handleBreadcrumbClick(breadcrumbs.length - 2)}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          
          {breadcrumbs.map((crumb, index) => (
            <Button
              key={index}
              onClick={() => handleBreadcrumbClick(index)}
              sx={{
                textTransform: "none",
                p: 0,
                minWidth: 0,
                fontWeight: index === breadcrumbs.length - 1 ? "bold" : "normal",
              }}
              disabled={index === breadcrumbs.length - 1}
            >
              {crumb.name}
              {index < breadcrumbs.length - 1 && "/"}
            </Button>
          ))}
        </Box>

        <Divider />

        {/* Folders List */}
        <Box sx={{ height: 300, overflow: "auto" }}>
          {currentParentId === "root" && (
            <Button
              fullWidth
              disabled
              sx={{
                justifyContent: "flex-start",
                px: 3,
                color: "text.primary",
                "&:disabled": { opacity: 1 },
              }}
              startIcon={<FolderIcon />}
            >
              Root Directory
            </Button>
          )}

          {getFoldersByParentId(currentParentId).map((folder) => (
            <Button
              key={folder.id}
              fullWidth
              sx={{ justifyContent: "flex-start", px: 3, textTransform: "none" }}
              startIcon={<FolderIcon />}
              onClick={() => handleFolderClick(folder)}
            >
              {folder.name}
            </Button>
          ))}
        </Box>

        <Divider />

        {/* Actions */}
        <Box sx={{ p: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button variant="outlined" onClick={resetModal}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleMove}
            disabled={isSameLocation || !currentItem}
            sx={{ 
              bgcolor: isSameLocation ? "grey.300" : "primary.main",
              "&:hover": {
                bgcolor: isSameLocation ? "grey.300" : "primary.dark"
              }
            }}
          >
            Move Here
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

MoveModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fileSystem: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  currentItem: PropTypes.object,
  onMove: PropTypes.func.isRequired,
};

export default MoveModal;