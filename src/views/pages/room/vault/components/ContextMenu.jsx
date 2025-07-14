import React from "react";
import { Menu, MenuItem } from "@mui/material";
import PropTypes from "prop-types";

import MoveIcon from "@mui/icons-material/DriveFileMove";
import { Close, Delete } from "@mui/icons-material";

const ContextMenu = ({
  contextMenu,
  handleClose,
  handleDownload,
  handleDelete,
  handleMove,
}) => {
  return (
    <Menu
      open={Boolean(contextMenu)}
      onClose={handleClose}
      anchorReference="anchorPosition"
      anchorPosition={
        contextMenu
          ? { top: contextMenu.top, left: contextMenu.left }
          : undefined
      }
    >
      <MenuItem onClick={handleMove}>
        <MoveIcon fontSize="small" sx={{ mr: 1.5 }} />
        Move
      </MenuItem>
      {/* <MenuItem onClick={handleDownload}>
        <Download fontSize="small" sx={{ mr: 1.5 }} />
        Download
      </MenuItem> */}
      <MenuItem onClick={handleDelete}>
        <Delete fontSize="small" sx={{ mr: 1.5 }} />
        Delete
      </MenuItem>
      <MenuItem onClick={handleClose}>
        <Close fontSize="small" sx={{ mr: 1.5 }} />
        Close
      </MenuItem>
    </Menu>
  );
};

ContextMenu.propTypes = {
  contextMenu: PropTypes.shape({
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
  }),
  handleClose: PropTypes.func.isRequired,
  // handleDownload: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleMove: PropTypes.func.isRequired,
};

export default ContextMenu;
