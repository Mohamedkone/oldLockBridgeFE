import { Grid, IconButton, Tooltip, Typography } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DescriptionIcon from "@mui/icons-material/Description";

export const FileGridItem = ({ item, handleFolderClick, handleRightClick }) => (
  <Grid
    item
    sx={{
      display: "flex",
      justifyContent: "center",
      textAlign: "center",
      p: 0,
      paddingTop: 0,
      width: "100px",
    }}
    onContextMenu={(event) => handleRightClick(event, item)}
  >
    <Tooltip title={item.name}>
      <IconButton
        onClick={item.type === "folder" ? () => handleFolderClick(item) : null}
        sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth:"10ch", minHeight:"10ch" }}
      >
        {item.type === "folder" ? (
          <FolderIcon sx={{ fontSize: 60, color: "#F8D775" }} />
        ) : (
          <DescriptionIcon sx={{ fontSize: 60, color: "#3164bd" }} />
        )}
        <Typography variant="caption" sx={
            {
                marginTop: 1,
                textAlign: "center",
                display: "-webkit-box",
                WebkitLineClamp: 1,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                wordWrap: "break-word",
                maxWidth: "11ch",
            }
        }>
          {item.name.slice(0, 50)}
        </Typography>
      </IconButton>
    </Tooltip>
  </Grid>
);