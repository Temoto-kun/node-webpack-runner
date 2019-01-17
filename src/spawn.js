const ChildProcess = require('child_process')
const path = require('path')
const nodemon = require('nodemon')

function spawn(basePath, scriptName, isNodemonProcess) {
  const scriptPath = path.join(basePath, scriptName)
  if (isNodemonProcess) {
    return nodemon({
      script: scriptPath,
      ext: 'js jsx json mjs',
    })
  }
  return ChildProcess.exec(`node ${scriptPath}`)
}

module.exports = spawn
