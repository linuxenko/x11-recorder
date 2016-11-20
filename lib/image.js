var PNG = require('pngjs').PNG;
var fs = require('fs');

var Image = function(display, geometry, image) {
  var rscreen = display.screen[0];
  this.screen =
    rscreen.depths[rscreen.root_depth][
      Object.keys(rscreen.depths[rscreen.root_depth])[0]];

  this.originalWidth = geometry.ow || geometry.w,
  this.width = geometry.w;
  this.height = geometry.h;
  this.x = geometry.x;
  this.y = geometry.y;
  this.image = this.encode(image.data);
};

Image.prototype.encode = function(image) {
  var rmask = parseInt(this.screen.red_mask, 10);
  var gmask = parseInt(this.screen.green_mask, 10);
  var bmask = parseInt(this.screen.blue_mask, 10);

  var data = Buffer.alloc((this.width * this.height) * 4);

  for (var x = this.x, xa = 0; x < (this.width + this.x); x++, xa++) {
    for (var y = this.y, ya = 0; y < (this.height + this.y); y++, ya++) {
      var pixel = Buffer.from([
        image[(x + this.originalWidth * y) * 4],
        image[(x + this.originalWidth * y) * 4 + 1],
        image[(x + this.originalWidth * y) * 4 + 2], 0]).readInt32LE();

      data[(xa + this.width * ya) * 4] = (pixel & rmask) >> 16;
      data[(xa + this.width * ya) * 4 + 1] = (pixel & gmask) >> 8;
      data[(xa + this.width * ya) * 4 + 2] = (pixel & bmask) >> 0;
      /*
       *  PR gifencoder noalpha support
       */
      data[(xa + this.width * ya) * 4 + 3] = 0xff;
    }
  }
  return data;
};

Image.prototype.write = function(fileName) {
  var png = new PNG( {
    inputHasAlpha : true,
    width : this.width,
    height : this.height,
    deflateChunkSize: 32*1024,
    deflateLevel: 9,
    deflateStrategy: 0,
  });

  png.data = this.image;
  png.pack().pipe(fs.createWriteStream(fileName));
};

module.exports = Image;
