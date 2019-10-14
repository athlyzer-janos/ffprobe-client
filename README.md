# ffprobe-client

[![npm version](https://badge.fury.io/js/ffprobe-client.svg)](https://badge.fury.io/js/ffprobe-client)
[![Build Status](https://travis-ci.org/ScottyFillups/ffprobe-client.svg?branch=master)](https://travis-ci.org/ScottyFillups/ffprobe-client)
[![Coverage Status](https://coveralls.io/repos/github/ScottyFillups/ffprobe-client/badge.svg?branch=master)](https://coveralls.io/github/ScottyFillups/ffprobe-client?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=ffprobe-client)](https://packagephobia.now.sh/result?p=ffprobe-client)

A zero-dependency, promise-based Node.js API for `ffprobe`.

Below is a comparison between `ffprobe-client` and other popular `ffprobe` libraries, as of August 23<sup>rd</sup>, 2018:

|                              | ffprobe-client |           ffprobe           | node-ffprobe |
|------------------------------|:--------------:|:---------------------------:|:------------:|
|          promise API         |        ✔       |              ✔              |       ✘      |
|      custom ffprobe path     |        ✔       |              ✔              |       ✘      |
|         -show_format         |        ✔       |              ✘              |       ✔      |
| electron support<sup>1</sup> |        ✔       |              ✘              |       ✘      |
|         dependencies         |      none!     | JSONStream, bl, deferential |     none!    |
|         last publish         |   2018-08-23   |          2016-01-02         |  2013-04-20  |

* <sup>1</sup>https://github.com/eugeneware/ffprobe/pull/1

## Usage

```js
// optional: specify a binary path, see config
process.env.FFPROBE_PATH = '/usr/bin/ffprobe'
const ffprobe = require('ffprobe-client')

const file = './path/to/file'
const url = 'http://www.example.com/foo.webm'

// promise
ffprobe('./myfile.webm')
  .then(data => console.log(data.format.duration))
  .catch(err => console.error(err))

// async/await
async function run () {
  try {
    const data = await ffprobe('http://www.example.com/foo.webm')

    console.log(data)
  } catch (err) {
    console.error(err)
  }
}

run()
```

## API

#### ffprobe(target, [config])

Returns a `Promise` which resolves to a `JSON` outputted by `ffprobe`.

#### target

Type: `String`

The file path or URL of the stream for `ffprobe` to analyze. Older versions of `ffprobe` seem to segfault when passed in a URL; please try to keep your `ffprobe` binary up to date.

#### config

Type: `Object`

A configuration object, see details below.

#### config.path

Type: `String`

The path of the `ffprobe` binary. If omitted, the path will be set to the `FFPROBE_PATH` environment variable. If the environment variable is not set, `ffprobe` will be invoked directly (ie. `ffprobe [...]`).


#### args

Type: `Array`

The args for the execFile command, If the args property is not set, the following args are used):
'-show_streams',
'-show_format',
'-print_format',
'json'

## Payload

the payload depends on your args. Here is an example of getting the keyFrames

let output = await ffprobe(filename,{},[
  "-loglevel",
  "error",
  "-skip_frame",
  "nokey",
  "-select_streams",
  "v:0",
  "-show_entries",
  "frame=pkt_pts_time",
  "-of",
  "csv=print_section=0",
])

and this an example output

0.000
8.000
16.000
...



## Testing Locally

Run `./scripts/gen-output.sh` before running the tests; this command will generate the expected JSON snapshot.
