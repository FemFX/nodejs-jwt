const express = require('express');

const router = express.Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken');

router.post('/signup', async (req, res) => {
  try {
    // Receiving Data
    const { username, email, password } = req.body;
    // Creating a new User
    const user = new User({
      username,
      email,
      password
    });
    user.password = await user.encryptPassword(password);
    await user.save();
    // Create a Token
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: 60 * 60 * 24 // expires in 24 hours
    });

    res.json({ auth: true, token });
  } catch (e) {
    console.log(e);
    res.status(500).send('There was a problem registering your user');
  }
});
router.post('/signin', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("The email doesn't exists");
  }
  const validPassword = await user.comparePassword(
    req.body.password,
    user.password
  );
  if (!validPassword) {
    return res.status(401).send({ auth: false, token: null });
  }
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 60 * 60 * 24
  });
  res.status(200).json({ auth: true, token });
});
router.post('/profile', verifyToken, async (req, res, next) => {
  const user = await User.findById(req.userId, { password: 0 });
  if (!user) {
    return res.status(404).send('No user found.');
  }
  res.status(200).json(user);
});
router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

module.exports = router;
