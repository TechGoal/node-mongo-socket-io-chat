const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const authHandler = require(path.resolve("./utilities/auth"));


// USER SIGN-IN METHOD
const signIn = function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  return User.findOne({ email: email }, function (err, user) {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({ token: null });
    }

    const token = authHandler.generateToken(user._id);
    return res.status(200).send({ token: token });
  });
};


// USER REGISTER METHOD
const register = function (req, res) {
  const hashedPassword = bcrypt.hashSync(req.body.password, 8);
  const payload = {
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    fullname: req.body.fullname,
  };

  return User.create(payload, function (err, user) {
    if (err)
      return res.status(500).send("There was a problem registering the user.");
    const token = authHandler.generateToken(user._id);
    return res.status(200).send({ token: token });
  });
};


// USER REGISTER METHOD
const me = function (req, res) {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) return res.status(401).send({ message: 'No token provided.' });
    return authHandler.verifyThisToken(token).then((userId) => {
      User.findById(userId, 
        { password: 0 }, // projection
        function (err, user) {
          if (err) return res.status(500).send("There was a problem finding the user.");
          if (!user) return res.status(404).send("No user found.");
          return res.status(200).send(user);
        });
    }).catch((err) => {
        return res.status(500).send(err);
    });
};


module.exports = {
  me,
  signIn,
  register,
};
