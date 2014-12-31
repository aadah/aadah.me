exports.db = 'aadah';
exports.entries = 'posts';
exports.visitors = 'ips';
exports.dbhost = '127.0.0.1';
exports.dbport = 27017;

exports.check = function(root) {
	function check_xhr(req, res, next) {
		if (!req.xhr) {
			res.sendfile(root + '/error/403.html');
		}
		else {
			next();
		}
	}

	return check_xhr;
}
