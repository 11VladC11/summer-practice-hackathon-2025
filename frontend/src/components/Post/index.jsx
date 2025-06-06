import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import {
  Box,
  IconButton,
  Button,
  Typography,
  Avatar,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import FolderZipOutlined from "@mui/icons-material/FolderZipOutlined";
import { fetchRemovePost } from "../../redux/slices/posts";
import axios from "../../axios";
import { PostSkeleton } from "./Skeleton";

export const Post = ({
  id,
  title,
  createdAt,
  imageUrl,
  user,
  tags,
  isFullPost,
  isLoading,
  description,
  isEditable,
  zipUrl,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.data?._id);

  const [fireCount, setFireCount] = React.useState(0);
  const [hasReacted, setHasReacted] = React.useState(false);

  React.useEffect(() => {
    const fetchPostReactions = async () => {
      try {
        const res = await axios.get(`/posts/${id}`);
        setFireCount(res.data.fireCount || 0);
        if (res.data.fireUsers?.includes(userId)) {
          setHasReacted(true);
        }
      } catch (err) {
        console.error("Error fetching fire status");
      }
    };
    fetchPostReactions();
  }, [id, userId]);

  const onClickFire = async () => {
    try {
      const res = await axios.post(`/posts/${id}/fire`);
      if (!res.data.alreadyReacted) {
        setFireCount((prev) => prev + 1);
        setHasReacted(true);
      } else {
        setHasReacted(true);
      }
    } catch (err) {
      console.error("Already reacted or error");
    }
  };

  const onClickRemove = () => {
    if (window.confirm("Do you want to delete this post?")) {
      dispatch(fetchRemovePost(id));
    }
  };

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        mb: 3,
        overflow: "hidden",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
          boxShadow: "0 0 20px rgba(58, 123, 213, 0.3)",
        },
      }}
    >
      {isEditable && (
        <Box sx={{ position: "absolute", top: 8, right: 8, zIndex: 1 }}>
          <RouterLink to={`/posts/${id}/edit`}>
            <IconButton
              color="primary"
              sx={{ bgcolor: "background.default", mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </RouterLink>
          <IconButton
            onClick={onClickRemove}
            color="secondary"
            sx={{ bgcolor: "background.default" }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      )}

      {imageUrl && (
        <Box
          component="img"
          src={imageUrl}
          alt={title}
          sx={{
            width: "100%",
            height: isFullPost ? 400 : 250,
            objectFit: "cover",
            display: "block",
          }}
        />
      )}

      <Box sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar src={user.avatarUrl} alt={user.fullName} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {user.fullName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(createdAt).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>

        <Typography
          variant={isFullPost ? "h4" : "h5"}
          component={isFullPost ? "h1" : RouterLink}
          to={!isFullPost ? `/posts/${id}` : undefined}
          sx={{
            color: "text.primary",
            textDecoration: !isFullPost ? "none" : "inherit",
            "&:hover": { color: "primary.main" },
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          {tags.map((tag) => (
            <RouterLink key={tag} to={`/tags/${tag}`}>
              <Typography
                variant="body2"
                color="primary.main"
                sx={{ textDecoration: "none" }}
              >
                #{tag}
              </Typography>
            </RouterLink>
          ))}
        </Stack>

        <Typography variant="body1" color="text.primary" sx={{ mb: 2 }}>
          {description}
        </Typography>

        {zipUrl && (
          <Button
            component="a"
            href={`http://localhost:4444${zipUrl}`}
            download
            startIcon={<FolderZipOutlined />}
            variant="contained"
            color="secondary"
            sx={{ mb: 2 }}
          >
            Download ZIP
          </Button>
        )}
		  	<Box>
			  {!isEditable && (
				 <Button
					variant="contained"
					onClick={onClickFire}
					disabled={hasReacted}
					sx={{
					  mt: 2,
					  backgroundColor: hasReacted ? "grey.700" : "primary.main",
					  "&:hover": {
						 backgroundColor: hasReacted ? "grey.700" : "primary.dark",
					  },
					}}
				 >
					{hasReacted
					  ? `🔥 Fire (${fireCount})`
					  : `That's fire (${fireCount})`}
				 </Button>
			  )}
			</Box>
      </Box>
    </Box>
  );
};
