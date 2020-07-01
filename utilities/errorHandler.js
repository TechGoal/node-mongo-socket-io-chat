const getMongoError = function(err) {
    const errResponse = {};
    const errMsg = err.message;
    if (errMsg) {
        if (err.original && err.original.code && err.original.code == 22001) {
            errResponse['resStatus'] = 422;
            errResponse['message'] = errMsg;
        } else if (errMsg.toLowerCase().includes('violates foreign key constraint')) {
            errResponse['resStatus'] = 422;
            errResponse['message'] = 'Lookes like relation exists of this entity. Please recheck the values.';
        } else if (errMsg.toLowerCase().includes('invalid input syntax for') || errMsg.toLowerCase().includes('invalid input value')) {
            errResponse['resStatus'] = 422;
            errResponse['message'] = 'Invalid value occured. Please recheck the values';
        } else if (errMsg.toLowerCase().includes('not found')) {
            errResponse['resStatus'] = 404;
            errResponse['message'] = errMsg;
        } else if (errMsg.toLowerCase().includes('validation error')) {
            errResponse['resStatus'] = 422;
            errResponse['message'] = err.errors.shift().message;
        } else {
            errResponse['resStatus'] = 500;
            errResponse['message'] = 'Unidentified error!';
        }
    } else {
        errResponse['resStatus'] = 500;
        errResponse['message'] = 'Unidentified error!';
    }
    errResponse['message'] = {
        'message': errResponse['message']
    };
    return errResponse;
};

const setResponseMessage = function(message) {
    const response = {
        'message': message
    };
    return response;
};

module.exports = {
    getMongoError,
    setResponseMessage
};
