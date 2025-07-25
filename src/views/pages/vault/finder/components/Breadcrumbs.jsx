import { Box, Button, Typography } from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import React from "react";

const Breadcrumbs = ({ breadcrumbs, displayedBreadcrumbs, handleGoBack }) => {
    return(
  <Box sx={{ marginBottom: 2, display: "flex", alignItems: "center", gap: 1 }}>
    {displayedBreadcrumbs.map((crumb, index) => (
      <React.Fragment key={index}>
        {crumb.id === "ellipsis" ? (
          <Typography sx={{ margin: "0 8px" }}>...</Typography>
        ) : (
          <Button
            onClick={() => handleGoBack(index)}
            sx={{
              textTransform: "none",
              fontWeight: index === displayedBreadcrumbs.length - 1 ? "bold" : "normal",
            }}
          >
            {crumb.name}
          </Button>
        )}
        {index < displayedBreadcrumbs.length - 1 && <ArrowRightIcon />}
      </React.Fragment>
    ))}
  </Box>
);
}

export default Breadcrumbs