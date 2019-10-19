const express = require('express');
const router = express.Router();
const mongoose = require('mongoose'); mongoose.set('useCreateIndex', true);
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

router.post('/signup', (req, res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if (user.length >= 1) {
      return res.status(409).json({
        message: "user already exists"
      });
    }
    else{
      bcrypt.hash(req.body.password, 10, (error, hash) => {
      if (error) {
        return res.status(500).json({
          error: error
        });
      }
      else {
        const user = new User({
          _id: new mongoose.Types.ObjectId(),
          email: req.body.email,
          password: hash   //password needs to be encrypted in db
        });
        return user
        .save()
        .then(result =>{
          console.log(result);
          res.status(201).json({
            message: "User created"
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            error:error
          });
        });
      }
    });

    }
  });
});

router.post('/login', (req,res, next) => {
  User.find({email: req.body.email})
  .exec()
  .then(user => {
    if (user.length < 1) {
      return res.status(401).json({
        message: "User doesn't exist"
      });
    }
    bcrypt.compare(req.body.password, user[0].password, (error, result) =>{
      if (error) {
        return res.status(401).json({
          message: "invalid"
        });
      }
      if (result) {
        const token = jwt.sign({
          email: user[0].email,
          userId: user[0]._id
        }, process.env.jwt_key, {
          expiresIn: "2h"
        });
        return res.status(200).json({
          message: "Authentication successful",
          token: token
        });
      }
      res.status(401).json({
        message: "invalid"
      });
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error:error
    });
  });
});


router.delete('/:userId', (req, res, next) => {
  User.remove({ _id: req.params.userId }).exec()
  .then(result => {
    res.status(200).json({
      message: "user deleted",
    });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({
      error:error
    });
});
});

module.exports = router;
