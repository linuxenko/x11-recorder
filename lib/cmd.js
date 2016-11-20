var core = require('./core');
var Overlay = require('./overlay');

var countDownInterval = null;

var countDown = function(seconds, callback) {
  callback = callback || function() {};
  var total = seconds < 1 ? 0 : seconds / 1000;
  var count = 1;
  var iterate = function() {
    if (count >= total) {
      clearInterval(countDownInterval);
      return callback();
    }
    process.stdout.write('.');
    count += 1;
  };

  if (total > 0) {
    countDownInterval = setInterval(iterate, 1000);
  } else {
    callback();
  }
};

exports.countDown = countDown;

exports.screenPoints = function(display, callback) {
  core.getGeometry(display.client, display.screen[0].root)(
    function(err, geometry) {
      if (err) return callback(err);
      var pointer = {
        x : geometry.xPos,
        y : geometry.yPos,
        w : geometry.width,
        h : geometry.height,
        ow : geometry.width,
        oh : geometry.height
      };
      callback(null, pointer);
    });
};

exports.showOverlay = function(display, callback) {
  var createOverlay = function(geometry, image) {
    var args = {
      X : display.client,
      root : display.screen[0].root,
      w : geometry.width,
      h : geometry.height,
      image : image
    };

    new Overlay(args, callback);
  };

  core.getGeometry(display.client, display.screen[0].root)(
    function(err, geometry) {
      if (err) return callback(err);

      core.getImage(display.client, display.screen[0].root, 0, 0,
        geometry.width, geometry.height)(function(err, image) {
          if (err) return callback(err);
          createOverlay(geometry, image);
        });
    });
};

exports.captureRegion = function(display, pointer, delay, callback) {
  countDown(delay, function() {
    core.getImage(display.client, display.screen[0].root,
      pointer.x, pointer.y, pointer.w, pointer.h)(function(err, image) {
        if (err) return callback(err);
        callback(null, image);
      });
  });
};
