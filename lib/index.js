var core = require('./core');
var Image = require('./image');
var Util = require('./util');
var CMD = require('./cmd');
var GIFEncoder = require('gifencoder');
var fs = require('fs');

var error = function(err, X) {
  console.error(err);
  if (X) {
    X.terminate();
  }
  process.exit(1);
};

var writeScreenshot = function(img, commander) {
  var fileName = createFileName(commander, 'png');
  img.write(fileName);
  process.stdout.write('\r' + fileName + '\n');
};

var createFileName = function(commander, ext) {
  var fileName;
  if (commander.args[0]) {
    fileName = commander.args[0];
  } else {
    fileName = commander.output + Util.getTime() + '-rec.' + ext;
  }
  return fileName;
};

var startRecorder = function(display, pointer, commander) {
  var fileName = createFileName(commander, 'gif');
  var frame = 1;

  var imgPointer = Object.create(pointer);
  imgPointer.x = imgPointer.y = 0;
  imgPointer.ow = imgPointer.w;

  var encoder = new GIFEncoder(pointer.w, pointer.h);
  encoder.createReadStream().pipe(fs.createWriteStream(fileName));
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(commander.rate);
  encoder.setQuality(commander.quality);

  var captureFrame = function() {
    CMD.captureRegion(display, pointer, 0, function(err, image) {
      if (err) return error(err, display.client);

      var img = new Image(display, imgPointer, image);
      if (commander.pointer === true) {
        img.drawCursor();
      }
      encoder.addFrame(img.image);
      process.stdout.write('\r' + 'frame ' + frame);
    });
  };

  var captureComplete = function() {
    process.stdout.write('\r' + fileName + '\n');
    display.client.terminate();
  };

  captureFrame();

  var captureInterval = setInterval(function() {
    if (frame >= commander.count) {
      clearInterval(captureInterval);
      captureComplete();
      return;
    }
    captureFrame();
    frame++;
  }, commander.rate);
};

var init = function(callback) {
  core.createX11Client()(function(err, display) {
    if (err) return error(err);
    callback(display);
  });
};

var main = function(display, commander) {
  var X = display.client;
  var delay = commander.delay;

  X.on('error', error);

  if (commander.measure === true) {
    if (commander.fullscreen === true) {
      CMD.screenPoints(display, function(err, pointer) {
        if (err) return error(err, X);
        console.log(pointer);
        X.terminate();
      });
    } else {
      CMD.showOverlay(display, function(err, pointer) {
        if (err) return error(err, X);
        console.log(pointer);
        X.terminate();
      });
    }
    return;
  }

  if (commander.screenshot === true && commander.fullscreen === true) {
    CMD.screenPoints(display, function(err, pointer) {
      if (err) return error(err, X);

      CMD.captureRegion(display, pointer, delay, function(err, image) {
        if (err) return error(err, X);

        var img = new Image(display, pointer, image);
        if (commander.pointer === true) {
          img.drawCursor();
        }
        writeScreenshot(img, commander);
        X.terminate();
      });
    });
    return;
  }

  if (commander.screenshot === true) {
    CMD.showOverlay(display, function(err, pointer) {
      if (err) return error(err, X);

      CMD.captureRegion(display, pointer, delay, function(err, image) {
        if (err) return error(err, X);

        pointer.x = pointer.y = 0;
        pointer.ow = pointer.w;

        var img = new Image(display, pointer, image);
        if (commander.pointer === true) {
          img.drawCursor();
        }
        writeScreenshot(img, commander);
        X.terminate();
      });
    });
    return;
  }

  if (commander.fullscreen === true) {
    CMD.screenPoints(display, function(err, pointer) {
      if (err) return error(err, X);

      CMD.countDown(delay, function() {
        startRecorder(display, pointer, commander);
      });
    });
    return;
  }

  CMD.showOverlay(display, function(err, pointer) {
    if (err) return error(err, X);

    CMD.countDown(delay, function() {
      startRecorder(display, pointer, commander);
    });
  });

};

module.exports = function(commander) {
  init(function(display) {
    main(display, commander);
  });
};
