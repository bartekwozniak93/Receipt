var ValidToken = require('../models/validToken');

exports.postValidToken = function(validToken, userId) {
    validToken = new ValidToken({
        value: validToken,
        userId: userId
    });

    validToken.save(function(err) {
        if (err)
            console.log(err);
    });
};

exports.deleteValidToken = function(validToken) {
    ValidToken.remove({ value: validToken }, function(err) {
        if (err)
            console.log(err);
    });
};