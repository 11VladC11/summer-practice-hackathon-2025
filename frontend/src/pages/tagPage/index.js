import { useDispatch, useSelector } from "react-redux";
import { Post } from "../../components/Post";
import { useEffect } from "react";
import { fetchPostsWithTagName } from "../../redux/slices/posts";
import { useNavigation, useParams } from "react-router-dom";

const TagPage = () => {
  const dispatch = useDispatch();
  const { tagName } = useParams();
  
  const userData = useSelector((state) => state.auth.data);
  const { tagPosts } = useSelector((state) => state.posts);

  useEffect(() => {
    dispatch(fetchPostsWithTagName(tagName));
  }, [dispatch, tagName]);

  const isLoading = tagPosts.status === "loading";
  return (
    <>
      <h1>#{tagName}</h1>
      {isLoading
        ? [...Array(5)].map((_, index) => <Post key={index} isLoading={true} />)
        : tagPosts.items.map((post) => {
            console.log("post.user._id", post.user._id);
            return (
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
                  post.imageUrl ? `http://localhost:4444${post.imageUrl}` : ""
                }
                user={post.user}
                createdAt={post.createdAt}
                commentsCount={post.commentsCount}
                tags={post.tagsTheme}
                isEditable={userData?._id === post.user._id}
              />
            );
          })}
    </>
  );
};

export default TagPage;
