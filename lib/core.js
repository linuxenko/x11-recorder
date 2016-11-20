var x11 = require('x11');

exports.createX11Client = function() {
  return function(callback) {
    x11.createClient(function(err, display) {
      if (err) return callback(err);

      return callback(null, display);
    }).on('error', callback);
  };
};

exports.getGeometry = function(X, wid) {
  return function(callback) {
    X.GetGeometry(wid, function(err, geometry) {
      if (err) return callback(err);
      return callback(null, geometry);
    });
  };
};

exports.getImage = function(X, wid, x, y, w, h) {
  return function(callback) {
    X.GetImage(2, wid, x, y, w, h, 0xffffffff, function(err, image) {
      if (err) return callback(err);
      return callback(null, image);
    });
  };
};
