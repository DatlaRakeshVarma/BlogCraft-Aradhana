const express = require('express');
const { body } = require('express-validator');
const {
  getPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
  getMyPosts
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const postValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long')
];

// Routes
router.get('/', getPosts);
router.get('/my-posts', protect, getMyPosts);
router.get('/:id', getPost);
router.post('/', protect, postValidation, createPost);
router.put('/:id', protect, postValidation, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comments', protect, addComment);
router.delete('/:id/comments/:commentId', protect, deleteComment);

module.exports = router;