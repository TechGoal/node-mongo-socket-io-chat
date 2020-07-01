const path = require('path');
const HomeController = require(path.resolve('./modules/home/home.controller'));

module.exports = function(router){
    router.get('/', HomeController.home);
};