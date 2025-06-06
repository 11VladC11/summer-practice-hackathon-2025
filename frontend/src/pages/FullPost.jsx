import React from "react";
import { useParams } from "react-router-dom";
import { Post } from "../components/Post";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import ReactMarkdown from "react-markdown";
import axios from "../axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchComments } from "../redux/slices/comments";

export const FullPost = () => {
  const dispatch = useDispatch();
  const comments = useSelector(state => state.comments.comments.items)
  const userData = useSelector(state => state.auth.data);
  console.log('comments', comments)
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  React.useEffect(() => {
    dispatch(fetchComments(id))
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("err", err);
        alert("Failed to get the article");
      });

  }, [dispatch]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        location={data.location}
        description={data.text}
        budget={data.budget}
        maxAttendes={data.maxAttendes}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={data.createdAt}
        attendesCount={data.attendesCount}
        tags={data.tagsTheme}
        zipUrl={data.zipUrl}
        isEditable={userData?._id === data.user._id}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
      <CommentsBlock items={comments} isLoading={false}>
        <Index />
      </CommentsBlock>
    </>
  );
};
