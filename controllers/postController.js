const Post = require('../models/Post');
const User = require('../models/User');

exports.getPosts = async (req, res) => {
  const user = await User.findById(req.userId);

  let posts;
  if (user.role === 'admin' || user.role === 'editor') {
    posts = await Post.find().populate('user', 'username');
  } else {
    posts = await Post.find({ user: req.userId }).populate('user', 'username');
  }

  res.json(posts);
};



exports.createPost = async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role === 'editor') {
    return res.status(403).json({ msg: 'Editors cannot create posts' });
  }

  const { title, content } = req.body;
  const post = await Post.create({ title, content, user: req.userId });
  res.status(201).json(post);
};


exports.updatePost = async (req, res) => {
  const user = await User.findById(req.userId);
  if (user.role !== 'admin' && user.role !== 'editor') {
    return res.status(403).json({ msg: 'Only admin/editor can update posts' });
  }

  const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(post);
};


exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await Post.findOneAndDelete({ _id: id, user: req.userId });
  res.json({ msg: 'Deleted' });
};
