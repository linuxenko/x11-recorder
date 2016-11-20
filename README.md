### XREC - Desktop recorder for x11 (xorg).

[![npm version](https://img.shields.io/npm/v/xrec.svg)](https://www.npmjs.com/package/xrec)

`xrec` helps you capture any area of your screen either as a screenshot or record a gif file.

[![CURRENTLY RECORDING](https://raw.githubusercontent.com/linuxenko/x11-recorder/master/screenshot.gif)](https://github.com/linuxenko/x11-recorder)

Would you like record something like this ? `xrec` is exactly for it.

### Why ?

I'm just tired implement different hacks with different tools.
I remember the pain calculate positions for makeing options for `byzanz` and its family.
This tool just made by me for me, but i think it may help someone else, therefore i share it with BSD License.

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
  Usage: index [options] <file ...>

  Options:

    -h, --help                 output usage information
    -V, --version              output the version number
    -d, --delay [seconds]      delay before start recording (seconds)
    -r, --rate [milliseconds]  capture frames rate (default: 1200)
    -c, --count [number]       total frames to capture (default : 10)
    -m, --measure              measure region and exit
    -o, --output [directory]   current directory by default
    -f, --fullscreen
    -s, --screenshot
```

### License

BSD (c) Svetlana Linuxenko
