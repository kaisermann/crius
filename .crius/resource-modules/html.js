const lazypipe = require('lazypipe')
const gulpIf = require('gulp-if')
const nunjucksRender = require('gulp-nunjucks-render')
const htmlmin = require('gulp-htmlmin')

const crius = require('../manifest.js')

module.exports = {
  pipelines: {
    each: asset => {
      return lazypipe()
        .pipe(() => gulpIf('*.nunjucks', nunjucksRender({
          path: './app',
        })))
        .pipe(() => gulpIf(file => !crius.params.debug && file.path.split('.').pop() === 'html',
          htmlmin({
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: {
              compress: {
                drop_console: true,
              },
            },
            processConditionalComments: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true,
          }))
        )
    },
  },
}
