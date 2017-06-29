const crius = require('../../manifest')
const { join } = require('path')

module.exports = function * (task) {
  yield task
    .source(join(crius.config.paths.source, 'scripts', 'wrapper.js'))
    .target(join(crius.config.paths.dist, 'scripts', 'main.js'))
}
