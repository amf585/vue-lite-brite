const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const router = express.Router();

// Load input validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User model
const User = require('../../models/User');
const Artwork = require('../../models/Artwork');

/**
 * @route  POST api/users/register
 * @desc   Register user
 * @access Public
 */
router.post('/register', (req, res) => {

  // Check validation
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ status: 'ERROR', message: 'Email already exists' });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});
  
/**
 * @route  POST api/users/login
 * @desc   Login user and return JWT token
 * @access Public
 */
router.post('/login', (req, res) => {

  // Check validation
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({ email }).then(user => {

    // Check if user exists
    if (!user) {
      return res.status(401).json({ status: 'ERROR', message: 'Invalid credentials' });
    }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        
        // User match
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 2592000 // 1 month in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        return res
          .status(401)
          .json({ status: 'ERROR', message: 'Invalid credentials' });
      }
    });
  });
});

/**
 * @route  POST api/users/getartwork
 * @desc   load artwork for user
 * @access Public
 */
 router.post('/getartwork', (req, res) => {
  User.findOne({ id: req.id }).then(user => {
    user.save()
        .then(user => res.json(user.savedArt))
        .catch(err => console.log(err));
  });
});

/**
 * @route  POST api/users/saveartwork
 * @desc   Save new artwork for user
 * @access Public
 */
router.post('/saveartwork', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    user.savedArt = [...user.savedArt, new Artwork({ name: req.body.name, dots: req.body.dots })];
    user.markModified('savedArt');
    user.save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
  });
});

/**
 * @route  PUT api/users/updateartwork
 * @desc   Update existing artwork for user
 * @access Public
 */
 router.put('/updateartwork', (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
      let updatedArtwork = user.savedArt.find((art) => { return art._id.toString() === req.body.artId });
      updatedArtwork.dots = req.body.dots;
      user.markModified('savedArt');

      user.save()
        .then(user => res.json(user))
        .catch(err => console.log(err));
  });
});

module.exports = router;