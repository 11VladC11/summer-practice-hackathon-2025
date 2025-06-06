import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Tabs, Tab, Grid, Box, useTheme } from "@mui/material";

import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { CommentsBlock } from "../components/CommentsBlock";
import { fetchPosts, fetchTags } from "../redux/slices/posts";
import { MyNotifications } from "../components/MyNotifications/MyNotifications";
import { MyProfile } from "../components/MyProfile/MyProfile";
const tabRoutes = ["/", "/my-profile"];

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const userData = useSelector((state) => state.auth.data);
  const { posts, tags } = useSelector((state) => state.posts);

  const getActiveTabFromUrl = () => tabRoutes.indexOf(location.pathname);
  const [activeTab, setActiveTab] = useState(getActiveTabFromUrl());

  const loadData = () => {
    dispatch(fetchPosts());
  };

  useEffect(() => {
    dispatch(fetchTags());
  }, [dispatch]);

  useEffect(() => {
    loadData(activeTab);
  }, [activeTab, dispatch]);

  useEffect(() => {
    setActiveTab(getActiveTabFromUrl());
  }, [location]);

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
    navigate(tabRoutes[newValue], { replace: true });
  };

  const isLoading =
    activeTab === 0 ? posts.status === "loading" : posts.status === "loading";

  const displayedPosts = posts.items ;

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        minHeight: "100vh",
        pt: 4,
        pb: 4,
      }}
    >
      <Box sx={{ maxWidth: "lg", mx: "auto", px: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          sx={{
            mb: 3,
            "& .MuiTab-root": {
              color: theme.palette.text.secondary,
              fontWeight: 600,
              px: 3,
              textTransform: "none",
            },
            "& .Mui-selected": {
              color: theme.palette.primary.main,
            },
            "& .MuiTabs-indicator": {
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.success.main})`,
              height: 3,
            },
          }}
        >
          <Tab label="Community" />
          <Tab label="My Profile" />
        </Tabs>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {activeTab === 0 &&
              (isLoading
                ? [...Array(5)].map((_, i) => <Post key={i} isLoading />)
                : displayedPosts.map((post) => (
                    <Post
                      key={post._id}
                      id={post._id}
                      title={post.title}
                      location={post.location}
                      description={post.text}
                      budget={post.budget}
                      maxAttendes={post.maxAttendes}
                      attendesCount={post.attendesCount}
                      imageUrl={
                        post.imageUrl
                          ? `http://localhost:4444${post.imageUrl}`
                          : ""
                      }
                      user={post.user}
                      createdAt={post.createdAt}
                      commentsCount={post.commentsCount}
                      tags={post.tagsTheme}
                      isEditable={userData?._id === post.user._id}
                      sx={{
                        mb: 3,
                        borderRadius: 3,
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "scale(1.01)",
                          boxShadow: `0 0 20px ${theme.palette.primary.main}30`,
                        },
                      }}
                    />
                  )))}
            {activeTab === 1 && <MyProfile />} 
          </Grid>

          <Grid item xs={12} md={4}>
            <Box
              sx={{
                position: { md: "sticky" },
                top: { md: theme.spacing(10) },
              }}
            >
              {activeTab === 0 && (
                <TagsBlock
                  items={tags.items}
                  isLoading={tags.status === "loading"}
                  sx={{
                    mb: 4,
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 2,
                    boxShadow: 1,
                  }}
                />
              )}

              {activeTab === 1 && (
                <MyNotifications
                  items={[
                    {
                      user: {
                        fullName: "Zuckerberg",
                        avatarUrl: "https://mui.com/static/images/avatar/6.jpg",
                      },
                      text: "Liked your project",
                      link: "/posts/123",
                    },
                    {
                      user: {
                        fullName: "Anderson",
                        avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                      },
                      text: "Commented on your project",
                      link: "/posts/123",
                    },
                   
                  ]}
                  isLoading={false}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
