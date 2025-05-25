const express = require('express');
const router = express.Router();
const { body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/signup', [
    body('username').notEmpty().withMessage('User name is required').isLength({ min: 3 }).withMessage('User name must be at least 3 characters long'),
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], 
userController.signup);

router.post('/login', [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Invalid email format'),
    body('password').notEmpty().withMessage('Password is required')
], userController.login);

router.get('/profile', authMiddleware.authUser, userController.getProfile);

router.get('/logout', authMiddleware.authUser, userController.logout)

module.exports = router;