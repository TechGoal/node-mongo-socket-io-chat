const { body, validationResult } = require('express-validator');

// SIGN-IN VALIDATION RULES
const signInRules = [
  body('email').not().isEmpty().withMessage('Your email is not valid'),
  body('password', 'Your password must be at least 5 characters').not().isEmpty(),
];
    

// SIGN-IN VALIDATION RULES
const registerRules = [
  body('username').not().isEmpty().withMessage('Name must have more than 5 characters'),
  body('email').not().isEmpty().withMessage('Your email is not valid'),
  body('password', 'Your password must be at least 5 characters').not().isEmpty(),
];


const verifyRules = function(req, res, next){
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    } else {
      next();
    }
}

module.exports = {
    verifyRules,
    registerRules,
    signInRules
}