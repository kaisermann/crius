const { basename } = require('path')
const requireDir = require('require-directory')

// Defaults NODE_ENV to 'dev' if not set
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'dev'
}

// Array of file names (without extension) inside `.crius/tasks`
// that should be loaded after all others tasks

const tasks = {}

// Loads generic gulp tasks, except ones listed on `loadLater`
requireDir(module, './.crius/tasks', {
  visit: function (mod, modFileName) {
    tasks[basename(modFileName, '.js')] = mod
  },
})

console.log(tasks)
module.exports = tasks
