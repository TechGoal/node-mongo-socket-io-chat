const fs = require('fs');
const path = require('path');
const routesFolder = path.resolve('./modules');


// HELPER FUNCTION TO GET ALL ROUTES PATH
const getAllRoutesPath = function() {
    const allRoutesPath = [];
    fs.readdirSync(routesFolder).forEach((file) => {
        const fullPath = `${routesFolder}/${file}`;
        if (fs.existsSync(fullPath)) {
            fs.readdirSync(fullPath).forEach((nestedfile) => {
                if(nestedfile.includes('route')){
                    const routePath = `${fullPath}/${nestedfile}`.replace('.js', '');
                    allRoutesPath.push(routePath);
                }
            });
        }
    });
    return allRoutesPath;
};


// MAIN FUNCTION TO REGISTER ALL ROUTES
const registerRoutes = function(routerInstance) {
    return new Promise((resolve) => {
        const allRoutesPath = getAllRoutesPath();

        // LOAD ALL NESTED ROUTES FILE
        allRoutesPath.map((routeFile) => {
            require(routeFile)(routerInstance);
        });

        return resolve(routerInstance);
    });
};

module.exports = {
    registerRoutes
};
