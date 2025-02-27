'use strict'

const { execFile } = require('child_process')

/**
 * Executes ffprobe with provided arguments
 * @func    ffprobeExecFile
 * @param   {String}        path Path of the ffprobe binary
 * @param   {Array<String>} args Array of arguments passed to ffprobe
 * @returns {Promise<Object>}    Promise that resolves to the ffprobe JSON output
 */
function ffprobeExecFile (path, args) {
  return new Promise((resolve, reject) => {
    execFile(path,args,(err, stdout, stderr) => {
      if (err) {
        console.log("err ja");
        if (err.code === 'ENOENT') {
          reject(err)
        } else {
          const ffprobeErr = new Error(stderr.split('\n').pop())
          reject(ffprobeErr)
        }
      } else {
        resolve(stdout)
      }
    })
  })
}

/**
 * Analyzes a video with ffprobe
 * @func    ffprobe
 * @param   {String} target   The file path or remote URL of the video
 * @param   {Object} [config={}]             A configuration object
 * @param   {String} [config.path='ffprobe'] Path of the ffprobe binary
 * @returns {Promise<Object>} Promise that resolves to the ffprobe JSON output
 */
function ffprobe (target, config = {}, args) {
  const path = config.path || process.env.FFPROBE_PATH || 'ffprobe'
  if(!args){
    args = [
      '-show_streams',
      '-show_format',
      '-print_format',
      'json'
    ];
  }
  args.push(target);
  console.log("args",args);

  return ffprobeExecFile(path, args)
}

module.exports = ffprobe;
