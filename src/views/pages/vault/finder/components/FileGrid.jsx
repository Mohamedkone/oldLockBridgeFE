import { Grid } from "@mui/material";
import { FileGridItem } from "./FileGridItem";

const FileGrid = ({ currentItems, handleFolderClick, handleRightClick }) =>{
    return(
  <Grid container spacing={1} p={"10px"} gap={5}>
    {currentItems.map((item) => (
      <FileGridItem
        key={item.id}
        item={item}
        handleFolderClick={handleFolderClick}
        handleRightClick={handleRightClick}
      />
    ))}
  </Grid>
);
}

export default FileGrid