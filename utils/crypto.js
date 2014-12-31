var crypto = {};

var bcrypt = require('bcrypt');
var node_crypto = require('crypto');

crypto.genSalt = function () {
    return bcrypt.genSaltSync();
};

crypto.genHash = function (password, salt) {
    return bcrypt.hashSync(password, salt);
};

crypto.validatePassword = function (password, salt, hash) {
    return crypto.genHash(password, salt) === hash;
};

crypto.randomHash = function () {
    return node_crypto
        .createHash('sha256')
        .update(node_crypto.randomBytes(256))
        .digest('hex');
};

module.exports = crypto;
