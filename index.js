const FS = require('fs');
const path = require('path');
const express = require('express');
const expressRouter = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); 
// eslint-disable-next-line no-undef
const configFile = require(path.resolve('./config/config'))[process.env.NODE_ENV];
const app = express();

const setupConfigs = function () {
    return new Promise((resolve) => {
        for (let key in configFile) {
            // eslint-disable-next-line no-undef
            process.env[key] = configFile[key];
        }
        return resolve();
    });
}

const setupRoutes = function () {
    return new Promise((resolve, reject) => {
        const resisterRoutesPromise = require(path.resolve('./routes')).registerRoutes(expressRouter);
        resisterRoutesPromise.then((routerInstance) => {
            return resolve(routerInstance);
        }).catch((err) => {
            return reject(err);
        });
    });
}

const setupMongo = function () {
    return new Promise((resolve, reject) => {

        const mongooseConnectOptions = {
            'useCreateIndex': true,
            'useNewUrlParser': true,
            'useUnifiedTopology': true,
        };

        const ModelFolder = path.resolve('models');

        // GET ALL MODELS FROM FOLDER AND REGESTER
        FS.readdir(ModelFolder, (err, files) => {
            files.forEach(file => {
                require(ModelFolder + '/' + file);
            });
        });

        // AFTER REGISTER ALL MODELS CONNECT WITH MONGODB URL
        // eslint-disable-next-line no-undef
        mongoose.connect(process.env.DB_URL, mongooseConnectOptions, function (err, connectionResult) {
            if (err) {
                return reject(err);
            } else {
                console.log('MongoDB connected successfully.');
                return resolve(connectionResult);
            }
        });
    });
}

const setupServer = function () {
    const setupConfigsPromise = setupConfigs();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    setupConfigsPromise.then(() => {
        const setupMongoPromise = setupMongo();
        setupMongoPromise.then(() => {
            const setupRoutesPromise = setupRoutes();
            setupRoutesPromise.then((expressRouter) => {
                app.use('/', expressRouter);
                // eslint-disable-next-line no-undef
                app.listen(process.env.PORT);
                // eslint-disable-next-line no-undef
                console.log(`SERVER STARTED ON PORT ${process.env.PORT}!`);
            });
        })
    })
}

setupServer();