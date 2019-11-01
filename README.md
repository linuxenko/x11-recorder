### XREC - Desktop recorder for x11 (xorg).

[![npm version](https://img.shields.io/npm/v/xrec.svg)](https://www.npmjs.com/package/xrec) [![bsd](https://img.shields.io/npm/l/xrec.svg)](https://github.com/linuxenko/x11-recorder)

`xrec` helps you capture any area of your screen either as a screenshot or record a gif file.

[![CURRENTLY RECORDING](https://raw.githubusercontent.com/linuxenko/x11-recorder/master/screenshot.gif)](https://github.com/linuxenko/x11-recorder)

Would you like record something like this ? `xrec` is exactly for it !

### Why ?

1. Proof of concept :P
2. I'm just tired implement different hacks with different tools.
3. This tool just made by me for me, but i think it may help someone else, therefore i share it with BSD License.

### Features
  * Measure region of the screen
  * Take `.png` screenshot
  * Record `.gif`
  * Small amount of dependencies.

### How to

How to install ?

```sh
  npm install -g xrec
```

How to run it ?

```
  xrec
```

I'll share the `--help` output here.

```sh
  Usage: xrec [options] <file ...>

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -d, --delay [seconds]      delay before start recording (seconds)
    -r, --rate [milliseconds]  capture frames rate (default: 700)
    -c, --count [number]       total frames to capture (default : 15)
    -q, --quality [number]     compression level for gif (default : 10)
    -m, --measure              measure region and exit
    -o, --output [directory]   current directory by default
    -p, --pointer              Capture mouse cursor (default: no)
    -f, --fullscreen
    -s, --screenshot
```

### ChangeLog

**1.1.1**

  * Fix relative paths

**1.1.0**

  * Cursor capture support

**1.0.0**

  * Less numbers for default gif recording settings to make it slightly better
  * `-q` Option helps change `.gif` compression quality
  * screenshot.gif remade with new default settings

### License

BSD (c) Svetlana Linuxenko
