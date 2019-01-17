const path = require('path')

const compile = require('./compile')
const spawn = require('./spawn')
const webpackDefaultConfig = require('./webpack/default-config')

function onCompileSuccess(config, stats) {
  const { showStats, } = config

  if (!showStats) {
    return
  }
  process.stdout.write(`${stats.toString()}\n`)
}

function onCompileError(config, err) {
  process.stderr.write(`${err.toString()}\n`)
}

function getBasePath() {
  return path.join(path.resolve(__dirname, '..'), 'cache')
}

function getScriptName() {
  return 'script.js'
}

function createWebpackConfig(entry, customConfig) {
  const scriptName = getScriptName()
  const basePath = getBasePath()

  return Object.assign(
    {},
    webpackDefaultConfig,
    customConfig,
    {
      entry,
      output: {
        path: basePath,
        publicPath: customConfig && customConfig.output ? customConfig.output.publicPath : '/',
        filename: scriptName,
      },
    }
  )
}

function run(entry, config) {
  const { webpackConfig, nodemon: isNodemonProcess, } = config

  const scriptName = getScriptName()
  const basePath = getBasePath()

  const theWebpackConfig = createWebpackConfig(entry, webpackConfig)

  return new Promise((resolve, reject) => {
    compile(theWebpackConfig).then(
      (webpackStats) => {
        onCompileSuccess(config, webpackStats)
        resolve({
          childProcess: spawn(basePath, scriptName, isNodemonProcess),
          webpackStats,
        })
      },
      (error) => {
        onCompileError(config, error)
        reject({
          error,
        })
      }
    )
  })
}

module.exports = run
