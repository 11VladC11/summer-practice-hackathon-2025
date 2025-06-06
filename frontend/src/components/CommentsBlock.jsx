import Box from "@mui/material/Box";
// CommentsBlock.jsx
import React from "react";
import { useTheme } from "@mui/material/styles";
import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import Skeleton from "@mui/material/Skeleton";

export const CommentsBlock = ({ items, children, isLoading = true }) => {
  const theme = useTheme();

  return (
    <SideBlock title="Comments">
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start" sx={{ py: 1 }}>
              <ListItemAvatar>
                {isLoading ? (
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ bgcolor: theme.palette.background.default }}
                  />
                ) : (
                  <Avatar
                    alt={obj.user.fullName}
                    src={obj.user.avatarUrl}
                    sx={{
                      width: 40,
                      height: 40,
                      border: `2px solid ${theme.palette.primary.main}`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
                    }}
                  />
                )}
              </ListItemAvatar>

              {isLoading ? (
                <Box sx={{ display: "flex", flexDirection: "column", pl: 1 }}>
                  <Skeleton
                    variant="text"
                    height={25}
                    width={120}
                    sx={{ bgcolor: theme.palette.background.default, mb: 0.5 }}
                  />
                  <Skeleton
                    variant="text"
                    height={18}
                    width={230}
                    sx={{ bgcolor: theme.palette.background.default }}
                  />
                </Box>
              ) : (
                <ListItemText
                  primary={obj.user.fullName}
                  secondary={obj.text}
                  primaryTypographyProps={{
                    color: theme.palette.text.primary,
                    sx: { fontWeight: 600 },
                  }}
                  secondaryTypographyProps={{
                    color: theme.palette.text.secondary,
                    sx: { mt: 0.5 },
                  }}
                  sx={{ pl: 1 }}
                />
              )}
            </ListItem>
            <Divider
              variant="inset"
              component="li"
              sx={{ borderColor: theme.palette.background.default }}
            />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};