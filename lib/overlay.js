var x11 = require('x11');

var pointer = {};

var Window = function(args, callback) {
  var X = this.X = args.X;
  this.root = args.root;
  this.image = args.image;
  this.w = args.w;
  this.h = args.h;
  this.callback = callback || function() {};

  this.rootGC = X.AllocID();
  X.CreateGC(this.rootGC, this.root);

  this.wid = X.AllocID();
  X.CreateWindow(this.wid, this.root, 0, 0, this.w, this.h, 0, 0, 0, 0,
    {
      eventMask : x11.eventMask.Exposure|x11.eventMask.ButtonPress|
      x11.eventMask.ButtonRelease|x11.eventMask.PointerMotion,
      overrideRedirect : true
    });

  this.drawGC = X.AllocID();
  X.CreateGC(this.drawGC, this.wid, {
    foreground : 0x828282,
    lineWidth : 1,
    'function' : x11.gcFunction.GXinvert
  });

  X.MapWindow(this.wid);
  this.eventListener = this.event.bind(this);
  X.on('event', this.eventListener);
};

Window.prototype.clear = function() {
  this.X.PutImage(2, this.wid, this.rootGC, this.w, this.h, 0, 0, 0, 24, this.image.data);
};

Window.prototype.draw = function(pointer) {
  var x = pointer.x;
  var y = pointer.y;
  var w = pointer.w - x;
  var h = pointer.h - y;

  var gc = this.drawGC;

  this.X.PolyLine(0, this.wid, gc, [x, y, x, h + y ]);
  this.X.PolyLine(0, this.wid, gc, [x, y, x + w, y ]);
  this.X.PolyLine(0, this.wid, gc, [x + w, y, x + w, y +h ]);
  this.X.PolyLine(0, this.wid, gc, [x, y + h, x + w, y +h ]);
};

Window.prototype.destroy = function() {
  this.X.UnmapWindow(this.wid);
  this.X.DestroyWindow(this.wid);
  this.X.removeListener('event', this.eventListener);
  this.wid = null;
  this.drawGC = null;
  this.rootGC = null;
};

Window.prototype.expose = function() {
  this.clear();
};

Window.prototype.makePointer = function(pointer) {
  return {
    x : pointer.w > pointer.x ? pointer.x : pointer.w,
    y : pointer.h > pointer.y ? pointer.y : pointer.h,
    w : pointer.w > pointer.x ? pointer.w - pointer.x : pointer.x - pointer.w,
    h : pointer.h > pointer.y ? pointer.h - pointer.y : pointer.y - pointer.h,
    ow : this.w,
    oh : this.h
  };
};

Window.prototype.event = function(ev) {
  // Espose
  if (ev.type === 12) {
    return this.expose(ev);
  }

  // MotionNotify
  if (ev.type === 6) {
    // clear previous line
    if (pointer.x >= 0 && pointer.y >= 0) {
      if (pointer.w >= 0 && pointer.h >= 0) {
        this.draw(pointer);
      }
      pointer.w = ev.x;
      pointer.h = ev.y;
      return this.draw(pointer);
    }
  }

  //ButtonPress
  if (ev.type === 4) {
    pointer.x = ev.x;
    pointer.y = ev.y;
  }

  //ButtonRelease
  if (ev.type === 5) {
    if (pointer.x === pointer.w || pointer.h === pointer.y) {
      return this.callback('splitted');
    }

    pointer.w = ev.x;
    pointer.h = ev.y;

    this.destroy();
    setTimeout(function() {
      this.callback(null, this.makePointer(pointer));
      pointer = {};
    }.bind(this), 10);
  }
};

module.exports = Window;
