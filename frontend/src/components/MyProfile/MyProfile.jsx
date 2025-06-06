import React from "react";
import {
  Box,
  Typography,
  Avatar,
  Chip,
  Grid,
  Paper,
  Divider,
} from "@mui/material";
import { useSelector } from "react-redux";
import { Post } from "../Post";

const ProfileBadge = ({ badge }) => {
  if (!badge || !badge.name) return null;

  return (
    <Chip
      avatar={
        <Avatar
          src={
            badge.iconUrl ||
            "https://cdn-icons-png.flaticon.com/512/190/190411.png"
          }
          alt={badge.name}
        />
      }
      label={badge.name || "Unnamed Badge"}
      color="primary"
      variant="outlined"
      sx={{ mt: 2 }}
    />
  );
};

export const MyProfile = () => {
  const userData = useSelector((state) => state.auth.data);
  const allPosts = useSelector((state) => state.posts.posts.items);
console.log('allPosts', allPosts)
  if (!userData) return null;

  const fallbackBadge = {
    name: "Top G",
    iconUrl: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
  };

  const badge = userData.scaledBadge || fallbackBadge;

  const myPosts = allPosts?.filter((post) => post.user?._id === userData._id);

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar
              src={userData.avatarUrl}
              alt={userData.fullName}
              sx={{ width: 100, height: 100 }}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" fontWeight={600} gutterBottom>
              {userData.fullName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {userData.bio || "No bio set."}
            </Typography>
            {userData.location?.city && (
              <Typography variant="body2" color="text.secondary">
                🌆 {userData.location.city}
              </Typography>
            )}

            <ProfileBadge badge={badge} />
          </Grid>
        </Grid>
      </Paper>

      {/* User's Projects */}
      <Typography variant="h5" fontWeight={700} gutterBottom>
        My Projects
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Grid container spacing={2}>
        {myPosts && myPosts.length > 0 ? (
          myPosts.map((post) => (
            <Grid item xs={12} md={6} key={post._id}>
              <Post
                id={post._id}
                title={post.title}
                description={post.text}
                imageUrl={
                  post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ""
                }
                user={userData}
                createdAt={post.createdAt}
                commentsCount={post.commentsCount || 0}
                tags={post.tagsTheme || []}
                isEditable={true}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary">
            You haven't posted any projects yet.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};
