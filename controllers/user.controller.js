const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.signup = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    const existingUser = await userModel.findOne({ email });
    if(existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({ username, email, password:hashedPassword });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });
}

module.exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if(!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = user.generateAuthToken();
    res.cookie('token', token);

    res.status(200).json({ token, user, message: 'Login successful' });
}

module.exports.getProfile = async (req, res, next) => {
    res.status(200).json(req.user);
}

module.exports.logout = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.header.authorization?.split(' ')[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: 'Logged out'});
}