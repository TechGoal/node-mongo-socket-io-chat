const jwt = require('jsonwebtoken');


// VERIFY USER AUTH TOKEN
const verifyToken = function (req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }
    
  return jwt.verify(token, process.env['secret'], function(err, decoded) {
    if (err){
      return res.status(500).send({ message: 'Failed to authenticate token.' });
    }
      
    req.userId = decoded.id;
    next();
  });
}


// GENERATE USER-TOKEN 
const generateToken = function(userId){
  const jwtOptions = { 
    'id': userId 
  };
  return jwt.sign(jwtOptions, process.env['secret'], {
    expiresIn: 86400 // expires in 24 hours
  });
}


// ONLY VERIFY THE TOKEN
const verifyThisToken = function(token){
  return new Promise((resolve , reject) => {
    return jwt.verify(token, process.env['secret'], function(err, decoded) {
      if (err){
        return reject({ message: 'Failed to authenticate token.' });
      }else{
        return resolve(decoded.id);
      }
    });
  });
} 

module.exports = {
    verifyToken,
    generateToken,
    verifyThisToken
};