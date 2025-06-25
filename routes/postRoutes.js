const express = require('express');
const auth = require('../middleware/authMiddleware');
const allowRoles = require('../middleware/roleMiddleware');
const {
  getPosts,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/postController');

const router = express.Router();

router.use(auth);

router.get('/', getPosts);

router.post('/', allowRoles('user', 'admin'), createPost);

router.put('/:id', allowRoles('editor', 'admin'), updatePost);

router.delete('/:id', allowRoles('admin'), deletePost);

module.exports = router;
