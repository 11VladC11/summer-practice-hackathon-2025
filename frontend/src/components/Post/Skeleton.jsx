import React from "react";
import { Box, Stack, Skeleton } from "@mui/material";

export const PostSkeleton = () => (
  <Box
    sx={{
      backgroundColor: "background.paper",
      borderRadius: 2,
      p: 2,
      mb: 3,
    }}
  >
    <Stack spacing={1}>
      <Skeleton variant="rectangular" width="100%" height={300} />
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Skeleton variant="circular" width={40} height={40} sx={{ mr: 1 }} />
        <Box>
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="text" width={100} height={15} />
        </Box>
      </Box>
      <Skeleton variant="text" width="80%" height={45} />
      <Box sx={{ display: "flex", gap: 1 }}>
        <Skeleton variant="text" width={40} height={30} />
        <Skeleton variant="text" width={40} height={30} />
        <Skeleton variant="text" width={40} height={30} />
      </Box>
    </Stack>
  </Box>
);
