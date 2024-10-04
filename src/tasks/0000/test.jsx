import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  Bookmark,
  PlusCircle,
  Menu,
} from "lucide-react";

const initialForumData = {
  accountId: "12345-678-90123",
  username: "techEnthusiast",
  name: "Alex Johnson",
  picUrl: "/api/placeholder/30/30",
  posts: [
    {
      postId: "post1",
      username: "codeWizard",
      name: "Emma Smith",
      picUrl: "/api/placeholder/30/30",
      post: "Best practices for React state management in 2024?",
      postDescription:
        "I'm working on a large-scale React application and I'm curious about the current best practices for state management. What are your thoughts on Redux vs. Context API vs. Recoil?",
      upvotes: 245,
      downvotes: 12,
      tags: ["react", "state-management", "frontend"],
      createdAt: "2024-09-15T10:30:00Z",
      comments: [],
      isBookmarked: false,
    },
    {
      postId: "post2",
      username: "aiResearcher",
      name: "Dr. Sophia Lee",
      picUrl: "/api/placeholder/30/30",
      post: "Ethical considerations in AI development",
      postDescription:
        "As AI becomes more prevalent in our daily lives, what ethical considerations should developers keep in mind? How can we ensure AI systems are fair and unbiased?",
      upvotes: 189,
      downvotes: 5,
      tags: ["ai", "ethics", "technology"],
      createdAt: "2024-09-14T14:45:00Z",
      comments: [],
      isBookmarked: false,
    },
    {
      postId: "post3",
      username: "cryptoEnthusiast",
      name: "Michael Chen",
      picUrl: "/api/placeholder/30/30",
      post: "The future of decentralized finance (DeFi)",
      postDescription:
        "DeFi has been gaining traction in recent years. What are your predictions for the future of DeFi? How might it impact traditional financial systems?",
      upvotes: 132,
      downvotes: 8,
      tags: ["cryptocurrency", "defi", "blockchain"],
      createdAt: "2024-09-13T09:15:00Z",
      comments: [],
      isBookmarked: false,
    },
  ],
};

const Sidebar = ({ className }) => (
  <div className={`${className} w-64 p-4 bg-gradient-to-b from-purple-600 to-indigo-700 text-white`}>
    <h2 className="text-2xl font-bold mb-6">MyForum</h2>
    <nav className="space-y-4">
      {["Home", "Explore", "Bookmarks", "Profile"].map((item) => (
        <Button
          key={item}
          variant="ghost"
          className="w-full justify-start text-white hover:bg-white/10"
        >
          <span className="mr-2">{getIcon(item)}</span>
          {item}
        </Button>
      ))}
    </nav>
  </div>
);

const getIcon = (name) => {
  const icons = {
    Home: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    ),
    Explore: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
        <path
          fillRule="evenodd"
          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
    Bookmarks: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
      </svg>
    ),
    Profile: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };
  return icons[name] || null;
};

const Post = ({ post, onVote, onBookmark, onComment }) => {
  const [votes, setVotes] = useState(post.upvotes - post.downvotes);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleVote = (type) => {
    const newVotes = type === "up" ? votes + 1 : votes - 1;
    setVotes(newVotes);
    onVote(post.postId, newVotes);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(post.postId, !isBookmarked);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onComment(post.postId, newComment);
      setNewComment("");
    }
  };

  return (
    <Card className="mb-4 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center gap-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <img
          src={post.picUrl}
          alt={post.name}
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div>
          <h3 className="font-semibold">{post.name}</h3>
          <p className="text-sm opacity-75">@{post.username}</p>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <h4 className="font-bold text-xl mb-2">{post.post}</h4>
        <p className="text-gray-700 mb-4">{post.postDescription}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("up")}
              className="p-0 hover:text-green-500"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
            <span className="font-semibold text-lg">{votes}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleVote("down")}
              className="p-0 hover:text-red-500"
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="p-0 hover:text-blue-500"
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`p-0 ${
                isBookmarked ? "text-yellow-500" : "hover:text-yellow-500"
              }`}
            >
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {showComments && (
          <div className="mt-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
            <Button
              onClick={handleAddComment}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Post Comment
            </Button>
            <div className="mt-4 space-y-2">
              {post.comments.map((comment, index) => (
                <div key={index} className="bg-gray-100 p-2 rounded">
                  <p className="font-semibold">{comment.username}</p>
                  <p>{comment.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const SortDropdown = ({ onSort }) => (
  <select
    onChange={(e) => onSort(e.target.value)}
    className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
  >
    <option value="latest">Latest Posts</option>
    <option value="mostVoted">Most Voted</option>
    <option value="mostCommented">Most Commented</option>
  </select>
);

const NewPostDialog = ({ onNewPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    if (title && content) {
      onNewPost({
        title,
        content,
        tags: tags.split(",").map((tag) => tag.trim()),
      });
      setTitle("");
      setContent("");
      setTags("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-500 hover:bg-green-600 text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> New Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Post Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Post Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            placeholder="Tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <Button
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Create Post
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default function App() {
  const [posts, setPosts] = useState(initialForumData.posts);
  const [searchTerm, setSearchTerm] = useState("");

  const handleVote = (postId, newVotes) => {
    setPosts(
      posts.map((post) =>
        post.postId === postId ? { ...post, upvotes: newVotes } : post
      )
    );
  };

  const handleBookmark = (postId, isBookmarked) => {
    setPosts(
      posts.map((post) =>
        post.postId === postId ? { ...post, isBookmarked } : post
      )
    );
  };

  const handleComment = (postId, commentText) => {
    setPosts(
      posts.map((post) =>
        post.postId === postId
          ? {
              ...post,
              comments: [
                ...post.comments,
                { username: initialForumData.username, text: commentText },
              ],
            }
          : post
      )
    );
  };

  const handleSort = (sortType) => {
    const sortedPosts = [...posts].sort((a, b) => {
      if (sortType === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortType === "mostVoted") {
        return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
      } else if (sortType === "mostCommented") {
        return b.comments.length - a.comments.length;
      }
    });
    setPosts(sortedPosts);
  };

  const handleNewPost = (newPost) => {
    const post = {
      postId: `post${posts.length + 1}`,
      username: initialForumData.username,
      name: initialForumData.name,
      picUrl: initialForumData.picUrl,
      post: newPost.title,
      postDescription: newPost.content,
      upvotes: 0,
      downvotes: 0,
      tags: newPost.tags,
      createdAt: new Date().toISOString(),
      comments: [],
      isBookmarked: false,
    };
    setPosts([post, ...posts]);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.post.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.postDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar className="hidden sm:block" />
      <main className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Latest Discussions
            </h1>
            <div className="flex items-center space-x-2">
              <NewPostDialog onNewPost={handleNewPost} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="sm:hidden">
                    <Menu className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {["Home", "Explore", "Bookmarks", "Profile"].map((item) => (
                    <DropdownMenuItem key={item}>
                      <span className="mr-2">{getIcon(item)}</span>
                      {item}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mb-6 flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-48">
              <SortDropdown onSort={handleSort} />
            </div>
          </div>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 text-xl">
                No posts found. Be the first to start a discussion!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => (
              <Post
                key={post.postId}
                post={post}
                onVote={handleVote}
                onBookmark={handleBookmark}
                onComment={handleComment}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}