import PostCard from "./PostCard";

function PostList({ posts, onDelete, onEdit, handleSaveToggle }) {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post._id}
          postId={post._id}
          username={post.author.username}
          postOwner={post.author._id}
          image={post.images[0].url}
          caption={post.caption}
          likes={post.likes}
          onDelete={onDelete}
          onEdit={onEdit}
          isSaved={post.isSaved}
          handleSaveToggle={handleSaveToggle}
        />
      ))}
    </>
  );
}

export default PostList;
