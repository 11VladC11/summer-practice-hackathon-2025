import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Skeleton,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const MyNotifications = ({ items = [], isLoading = false }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: 2,
        boxShadow: 1,
      }}
    >
      <CardHeader title="Notifications" />
      <CardContent
        sx={{
          maxHeight: 400,
          overflowY: "auto",
          pr: 1,
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: theme.palette.background.default,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.primary.main,
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: theme.palette.primary.dark,
          },
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.background.default}`,
          scrollbarWidth: "thin",
        }}
      >
        <List disablePadding>
          {(isLoading ? [...Array(5)] : items).map((item, i) => (
            <React.Fragment key={i}>
              <ListItem
                alignItems="flex-start"
                button
                onClick={() => !isLoading && item.link && navigate(item.link)}
                sx={{
                  borderRadius: 0,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: `0 0 12px ${theme.palette.primary.main}66`,
                    backgroundColor: theme.palette.action.hover,
                    cursor: "pointer",
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <ListItemAvatar>
                      <Skeleton variant="circular" width={40} height={40} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Skeleton width="60%" />}
                      secondary={<Skeleton width="90%" />}
                    />
                  </>
                ) : (
                  <>
                    <ListItemAvatar>
                      <Avatar src={item.user.avatarUrl} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.user.fullName}
                      secondary={
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ whiteSpace: "pre-line" }}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  </>
                )}
              </ListItem>
              {i < (items.length || 5) - 1 && <Divider component="li" />}
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};
