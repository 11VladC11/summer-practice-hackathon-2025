import React from "react";
import { Link as RouterLink } from "react-router-dom";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";
import { useTheme } from "@mui/material/styles";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, isLoading = true }) => {
  const theme = useTheme();

  return (
    <SideBlock title="Technology Tags">
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          <ListItem key={i} disablePadding>
            {isLoading ? (
              <ListItemButton>
                <ListItemIcon sx={{ color: theme.palette.text.secondary }}>
                  <TagIcon />
                </ListItemIcon>
                <Skeleton
                  variant="text"
                  width={100}
                  sx={{ bgcolor: theme.palette.background.default }}
                />
              </ListItemButton>
            ) : (
              <ListItemButton
                component={RouterLink}
                to={`/tags/${encodeURIComponent(name)}`}
                sx={{
                  "&:hover": {
                    backgroundColor: theme.palette.primary.main + "10",
                  },
                }}
              >
                <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                  <TagIcon />
                </ListItemIcon>
                <ListItemText
                  primary={name}
                  primaryTypographyProps={{
                    color: theme.palette.text.primary,
                    sx: { fontWeight: 500 },
                  }}
                />
              </ListItemButton>
            )}
          </ListItem>
        ))}
      </List>
    </SideBlock>
  );
};
