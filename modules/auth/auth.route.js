const path = require('path');
const AuthController = require(path.resolve('./modules/auth/auth.controller'));
const { verifyRules, registerRules, signInRules } = require(path.resolve('./modules/auth/auth.validator'));

module.exports = function(router) {

    // GET CURRENT SIGN-IN USER
    router.get('/api/auth/me', AuthController.me);

    // SIGN-IN API
    router.post('/api/auth/sign-in', [...signInRules, verifyRules], AuthController.signIn);

    // REGISTER API
    router.post('/api/auth/register', [...registerRules, verifyRules], AuthController.register);

};